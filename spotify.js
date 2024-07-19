async function getTrackInfo(trackId, accessToken) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching track info:', error);
        throw error;
    }
}

const trackInfo = await getTrackInfo("7nHDd4pipYK2Gj9DAYQaDS", "BQA-ao5pRkz7Kjpba3R-PbGSlTL6jwQJcKiz2YxA9UNHUaTnSKVyTUg2hp2zIhtGrBw3WZAVrKJYk9HXlbBaCczGe_8_aOpBxUpkREZQUZ9KFuvyTlY");
console.log(trackInfo);

/* ******************************************
async function getAccessToken() {
    const clientId = '0e3fdb05b61d40f787517bfacde0591c';
    const clientSecret = 'a4fbb370276b44f791505679f9b604f2';
    const credentials = btoa(`${clientId}:${clientSecret}`);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials'
            })
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

getAccessToken().then(token => {
    console.log('Access Token:', token);
});
****************************************** */