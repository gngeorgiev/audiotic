package com.beatstr.audioPlayer;

import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.common.internal.Files;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;

class DownloadTrackTask extends AsyncTask<String, Void, Void> {
    @Override
    protected Void doInBackground(String... params) {

        return null;
    }
}

public class AudioPlayer extends ReactContextBaseJavaModule {
    private static final String TAG = "AudioPlayer";

    private static final String EVENT_ONCOMPLETED = "OnCompleted";

    private MediaPlayer player;
    private String dataSource;

    AudioPlayer(ReactApplicationContext reactContext) {
        super(reactContext);
        this.player = this.createMediaPlayer();
    }

    private MediaPlayer createMediaPlayer() {
        MediaPlayer player = new MediaPlayer();
        player.setAudioStreamType(AudioManager.STREAM_MUSIC);

        return player;
    }

    private void handleError(Exception e, Promise promise) {
        this.handleError("EAUDIOERROR", e, promise);
    }

    private void handleError(String code, Exception e, Promise promise) {
        Log.v(TAG, code, e);
        if (this.player.isPlaying()) {
            this.player.stop();
        }

        this.player.reset();
        this.player.release();
        this.player = null;
        this.player = this.createMediaPlayer();
        this.dataSource = null;

        promise.reject(code, e.getMessage(), e);
    }

    private void emitEvent(String ev, @Nullable WritableMap params) {
        this.getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(ev, params);
    }

    private File getDownloadsFolder() {
        File root = android.os.Environment.getExternalStorageDirectory();
        return new File(root.getAbsolutePath() + "/beatster/downloads");
    }

    private String getOfflineTrackPath(String filename) {
        return this.getDownloadsFolder().getAbsolutePath() + "/" + filename;
    }

    @Override
    public String getName() {
        return "AudioPlayer";
    }

    @ReactMethod
    public void getDownloadsFolderPath(Promise promise) {
        promise.resolve(this.getDownloadsFolder().getPath());
    }

    @ReactMethod
    public void stop(Promise promise) {
        try {
            this.player.stop();
            promise.resolve(null);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void pause(Promise promise) {
        try {
            this.player.pause();
            promise.resolve(null);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    private void addTrackToDataJson(String name, String id, String provider, String thumbnail, File path) throws Exception {
        String dataPath = path.getAbsolutePath() + "/data.json";
        File dataFile = new File(dataPath);
        boolean dataExists = dataFile.exists();
        if (!dataExists) {
                PrintWriter printWriter = new PrintWriter(dataPath, "utf-8");
                printWriter.write("[]");
                printWriter.close();
        }

        FileReader fileReader = new FileReader(dataPath);
        char[] chars = new char[(int) dataFile.length()];
        fileReader.read(chars);
        fileReader.close();
        String jsonString = new String(chars);
        JSONArray jsonArray = new JSONArray(jsonString);
        JSONObject trackObject = new JSONObject();
        trackObject.put("title", name);
        trackObject.put("id", id);
        trackObject.put("provider", provider);
        trackObject.put("thumbnail", thumbnail);
        trackObject.put("offline", true);
        jsonArray.put(trackObject);

        PrintWriter writer = new PrintWriter(dataPath, "utf-8");
        writer.println(jsonArray.toString());
        writer.close();
    }

    @ReactMethod
    public void saveToFile(final String streamUrl, final String name,
                           final String id, final String provider, final String thumbnail, final Promise promise) {
        try {
            final File dir = this.getDownloadsFolder();
            if (!dir.exists()) {
                dir.mkdirs();
            }


            final AudioPlayer self = this;

            final Thread t = new Thread(new Runnable() {
                public void run() {
                    try {
                        URL downloadUrl = new URL(streamUrl);
                        File file = new File(dir, id);

                        URLConnection conn = downloadUrl.openConnection();
                        InputStream inputStream = conn.getInputStream();
                        FileOutputStream fileOutputStream = new FileOutputStream(file);

                        BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
                        byte[] data = new byte[1024];
                        int current;
                        while ((current = bufferedInputStream.read(data, 0, data.length)) != -1) {
                            fileOutputStream.write(data, 0, current);
                        }

                        fileOutputStream.close();
                        self.addTrackToDataJson(name, id, provider, thumbnail, dir);
                        self.emitEvent("OnDownloaded", null);
                        promise.resolve(null);
                    } catch (Exception e) {
                        promise.reject(e);
                        Log.v(TAG, e.toString());
                    }
                }
            });

            t.start();
        } catch (Exception e) {
            promise.reject(e);
            Log.v(TAG, e.toString());
        }
    }

    @ReactMethod
    public void play(String urlOrname, boolean offline, final Promise promise) {
        //TODO: add a small go server that will run on the phone, we will stream through it
        //so we can both play the tracks and save them at the same time
        try {
            if (offline) {
                urlOrname = this.getOfflineTrackPath(urlOrname);
            }

            if (this.player.isPlaying() && this.dataSource.equals(urlOrname)) {
                promise.resolve(null);
                return;
            }

            if (urlOrname == null || urlOrname.equals("")) {
                urlOrname = this.dataSource;
            }

            if (this.dataSource != null && this.dataSource.equals(urlOrname)) {
                this.player.start();
                promise.resolve(null);
                return;
            }

            final AudioPlayer self = this;

            this.player.reset();
            this.player.setDataSource(urlOrname);
            this.player.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mp.start();
                    promise.resolve(null);
                }
            });
            this.player.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override
                public boolean onError(MediaPlayer mp, int what, int extra) {
                    self.handleError(Integer.toString(what), new Exception(Integer.toString(extra)), promise);
                    return true;
                }
            });
            this.player.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    self.emitEvent(EVENT_ONCOMPLETED, null);
                }
            });
            this.player.prepareAsync();
            this.dataSource = urlOrname;
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void getDuration(Promise promise) {
        try {
            int duration = this.player.getDuration();
            promise.resolve(duration);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void getCurrentPosition(Promise promise) {
        try {
            int pos = this.player.getCurrentPosition();
            promise.resolve(pos);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void isPlaying(Promise promise) {
        try {
            boolean isPlaying = this.player.isPlaying();
            promise.resolve(isPlaying);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }
}