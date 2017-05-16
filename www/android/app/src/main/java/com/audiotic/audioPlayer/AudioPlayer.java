package com.audiotic.audioPlayer;

import android.media.AudioManager;
import android.media.MediaPlayer;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AudioPlayer extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static final String TAG = "AudioPlayer";

    private static final String ON_TRACK_END = "ON_TRACK_END";

    private MediaPlayer player;
    private String dataSource;

    private boolean isPaused = false;

    AudioPlayer(ReactApplicationContext reactContext) {
        super(reactContext);
        if (player == null) {
            player = this.createMediaPlayer();
        }

        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onHostDestroy() {
        this.player.stop();
        this.player.release();
    }

    @Override
    public void onHostResume() {
        // Activity `onResume`
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
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
        if (player.isPlaying()) {
            player.stop();
        }

        player.reset();
        player.release();
        player = null;
        player = this.createMediaPlayer();
        dataSource = null;

        promise.reject(code, e.getMessage(), e);
    }

    private void emitEvent(String ev, @Nullable WritableMap params) {
        this.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(ev,
                params);
    }

    @Override
    public String getName() {
        return "AudioPlayer";
    }

    @ReactMethod
    public void stop(Promise promise) {
        try {
            player.stop();
            this.isPaused = false;
            promise.resolve(null);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void pause(Promise promise) {
        try {
            player.pause();
            this.isPaused = true;
            promise.resolve(null);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void play(String urlOrname, final Promise promise) {
        //TODO: add a small go server that will run on the phone, we will stream through it
        //so we can both play the tracks and save them at the same time
        try {
            this.isPaused = false;

            if (player.isPlaying() && dataSource.equals(urlOrname)) {
                promise.resolve(null);
                return;
            }

            if (urlOrname == null || urlOrname.equals("")) {
                urlOrname = dataSource;
            }

            if (dataSource != null && dataSource.equals(urlOrname)) {
                player.start();
                promise.resolve(null);
                return;
            }

            final AudioPlayer self = this;

            player.reset();
            player.setDataSource(urlOrname);
            player.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    mp.start();
                    promise.resolve(null);
                }
            });
            player.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override
                public boolean onError(MediaPlayer mp, int what, int extra) {
                    self.handleError(Integer.toString(what), new Exception(Integer.toString(extra)), promise);
                    return true;
                }
            });
            player.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    self.emitEvent(ON_TRACK_END, null);
                }
            });
            player.prepareAsync();
            dataSource = urlOrname;
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void getDuration(Promise promise) {
        try {
            int duration = player.getDuration();
            promise.resolve(duration);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void getCurrentPosition(Promise promise) {
        try {
            if (!player.isPlaying() && !this.isPaused) {
                promise.resolve(0);
                return;
            }

            int pos = player.getCurrentPosition();
            promise.resolve(pos);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void isPlaying(Promise promise) {
        try {
            boolean isPlaying = player.isPlaying();
            promise.resolve(isPlaying);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }

    @ReactMethod
    public void seek(int position, final Promise promise) {
        try {
            player.setOnSeekCompleteListener(new MediaPlayer.OnSeekCompleteListener() {
                @Override
                public void onSeekComplete(MediaPlayer mp) {
                    promise.resolve(null);
                }
            });

            player.seekTo(position);
        } catch (Exception e) {
            this.handleError(e, promise);
        }
    }
}