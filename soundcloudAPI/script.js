const playButton = document.getElementById('start-button');
const volumeSlider = document.getElementById('music-volume');

const clientId = 'yTInTFyeJ10yiPJhRlQUbkBkQdWVyFpD';
const trackIdsFile = 'soundcloudAPI/songIds.txt';
const trackIdsRaw = await fetch(trackIdsFile);
const trackIds = (await trackIdsRaw.text()).split('\n').map(id => id.trim()).filter(id => id !== '');
let manualSeeking = true;
let currentTrackIndex;
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

function getDominantColor(imageUrl) {
    return new Promise((resolve) => {
        if (!imageUrl) {
            resolve('rgb(153, 153, 153)');
            return;
        }
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            resolve(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
        };
        img.onerror = () => {
            resolve('rgb(153, 153, 153)');
        };
    });
}

async function createWidget(trackId, color) {
    const oldIframe = document.querySelector('iframe');
    if (oldIframe) {
        oldIframe.remove();
    }
    if (!color) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&client_id=${clientId}`;
        document.querySelector('.invis').appendChild(iframe);
        widget = SC.Widget(iframe);

        widget.bind(SC.Widget.Events.READY, () => {
            widget.getCurrentSound(async function(music) {
                const dominantColor = await getDominantColor(music.artwork_url);
                createWidget(trackId, dominantColor);
            });
        });
    } else {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '20';
        iframe.style.border = '0';
        iframe.allow = 'autoplay';
        iframe.src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=${color}&client_id=${clientId}&auto_play=true`;
        document.querySelector('footer').appendChild(iframe);
        widget = SC.Widget(iframe);
    
        widget.bind(SC.Widget.Events.READY, async () => {
            widget.setVolume(volumeSlider.value);
        });
    
        widget.bind(SC.Widget.Events.FINISH, () => {
            playTrack();
        });
    
        widget.bind(SC.Widget.Events.ERROR, () => {
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
}

async function playTrack() {
    currentTrackIndex = newTrackIndex();
    const nextTrackId = trackIds[currentTrackIndex];
    await createWidget(nextTrackId, false);
}

playButton.addEventListener('click', async () => {
    playButton.parentElement.style.display = 'none';
    playTrack();
});

volumeSlider.addEventListener('input', () => {
    widget.setVolume(volumeSlider.value);
    document.querySelector(`label[for='${volumeSlider.id}']`).innerHTML = `Music volume: ${volumeSlider.value}%`;
});