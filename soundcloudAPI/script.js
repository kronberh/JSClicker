const playButton = document.getElementById('start-button');

const clientId = 'yTInTFyeJ10yiPJhRlQUbkBkQdWVyFpD';
const trackIdsFile = 'soundcloudAPI/songIds.txt';
const trackIds = (await (await fetch(trackIdsFile)).text()).split('\n').map(id => id.trim()).filter(id => id !== '');
let currentTrackIndex = newTrackIndex();
let manualSeeking = true;
let currentPosition;
let lastPosition;

function newTrackIndex() {
    return Math.floor(Math.random() * trackIds.length);
}

function createWidget(trackId) {
    console.log(`Creating widget for track ID: ${trackId}`);
    const iframe = document.createElement('iframe');
    iframe.id = 'sc-widget';
    iframe.width = '100%';
    iframe.height = '23';
    iframe.frameborder = 'no';
    iframe.scrolling = "no";
    iframe.allow = 'autoplay';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&client_id=${clientId}&auto_play=true`;
    document.body.appendChild(iframe);
    const widget = SC.Widget(iframe);

    widget.bind(SC.Widget.Events.READY, () => {
        console.log('Widget is ready');
        widget.setVolume(5);
    });

    widget.bind(SC.Widget.Events.FINISH, () => {
        console.log('Track finished, playing next track');
        playTrack();
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
        widget.play();
    });

    widget.bind(SC.Widget.Events.PLAY_PROGRESS, event => {
        lastPosition = currentPosition;
        currentPosition = event.currentPosition;
    });

    widget.bind(SC.Widget.Events.SEEK, () => {
        if (manualSeeking) {
            widget.seekTo(lastPosition);
        }
        manualSeeking = !manualSeeking;
    });
}

function onWidgetSeek() {
    widget.unbind(SC.Widget.Events.SEEK);
    widget.seekTo(lastPosition);
    widget.bind(SC.Widget.Events.SEEK, onWidgetSeek);
}

function playTrack() {
    console.log(`Playing next track. Current track index: ${currentTrackIndex}`);
    currentTrackIndex = newTrackIndex();
    const nextTrackId = trackIds[currentTrackIndex];
    console.log(`Next track ID: ${nextTrackId}`);

    const iframe = document.getElementById('sc-widget');
    if (iframe) {
        iframe.remove();
    }
    createWidget(nextTrackId);
}

playButton.addEventListener('click', async () => {
    playButton.parentElement.style.display = 'none';
    console.log(trackIds[currentTrackIndex]);
    createWidget(trackIds[currentTrackIndex]);
});