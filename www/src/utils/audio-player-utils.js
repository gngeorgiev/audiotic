export function secondsToTime(seconds = this.position) {
    seconds = Math.round(seconds);
    let minutesReadable = Math.round(seconds / 60);
    let secondsReadable = Math.round(seconds % 60);

    if (minutesReadable.toString().length === 1) {
        minutesReadable = `0${minutesReadable}`;
    }

    if (secondsReadable.toString().length === 1) {
        secondsReadable = `0${secondsReadable}`;
    }

    return `${minutesReadable}:${secondsReadable}`;
}
