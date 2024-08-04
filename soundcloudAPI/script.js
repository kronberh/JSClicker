const playButton = document.getElementById('start-button');
const volumeSlider = document.getElementById('music-volume');

const clientId = 'yTInTFyeJ10yiPJhRlQUbkBkQdWVyFpD';
const trackIdsFile = 'soundcloudAPI/songIds.txt';
const trackIds = (await (await fetch(trackIdsFile)).text()).split('\n').map(id => id.trim()).filter(id => id !== '');
let currentTrackIndex = newTrackIndex();
let manualSeeking = true;
let currentPosition;
let lastPosition;
let widget;

function newTrackIndex(currentIndex) {
    if (trackIds.length > 1) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * trackIds.length);
        } while (newIndex === currentIndex);
        return newIndex;
    } else {
        return 0;
    }
}

function createWidget(trackId) {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '20';
    iframe.style.border = '0';
    iframe.allow = 'autoplay';
    iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=0088ff&client_id=${clientId}&auto_play=true`;
    document.querySelector('footer').appendChild(iframe);
    widget = SC.Widget(iframe);

    widget.bind(SC.Widget.Events.READY, () => {
        widget.setVolume(volumeSlider.value);
    });

    widget.bind(SC.Widget.Events.FINISH, () => {
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

function playTrack() {
    currentTrackIndex = newTrackIndex();
    const nextTrackId = trackIds[currentTrackIndex];

    const iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.remove();
    }
    createWidget(nextTrackId);
}

playButton.addEventListener('click', async () => {
    playButton.parentElement.style.display = 'none';
    createWidget(trackIds[currentTrackIndex]);
});

volumeSlider.addEventListener('input', async () => {
    widget.setVolume(volumeSlider.value);
    document.querySelector(`label[for='${volumeSlider.id}']`).innerHTML = `Music volume: ${volumeSlider.value}%`;
});