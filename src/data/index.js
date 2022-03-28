function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return 'navigator geolocation is not supported by this browser.';
    }
}

function showPosition(position) {
    console.log(position)
    return { long: position.coords.longitude, lat: position.coords.latitude }
}

export async function weatherData() {
    let loc = getLocation()
        // let lat = 
    console.log(loc)
    return await fetch('https://api.darksky.net/forecast/[API_KEY]/[latitude], [longitude]').then(res => JSON.parse(res))
}

export function locationData() {
    return
}