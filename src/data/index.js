function getLocation() {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    return "navigator geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log(position);
  return { long: position.coords.longitude, lat: position.coords.latitude };
}

export async function weatherData(long, lat) {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=3c9decd67637537731578a01aee56710`,
    // `https://api.darksky.net/forecast/a177f8481c31fa96c3f95ad4f4f84610/${lat},${long}`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
}

export function locationData() {
  return;
}
