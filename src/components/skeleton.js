import React, { useEffect, useState } from "react";
import { weatherData, locationData } from "../data";
import bkg from "../assets/background.png";
import wIcon from "../assets/weather-icon.png";

export default function Skeleton() {
  const [tempType, setTempType] = useState("f");
  const [tmp, setTmp] = useState(0);
  const [tmpHigh, setTmpHigh] = useState(0);
  const [tmpLow, setTmpLow] = useState(0);
  const [comment, setComment] = useState("");
  const [long, setLong] = useState(-71);
  const [lat, setLat] = useState(20);
  const [city, setcity] = useState("city placeholder");
  const [date, setDate] = useState(0);
  //   console.log(weatherData());
  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(
        (e) => {
          showPosition(e);
          console.log(e);
        },
        (e) => console.log(e),
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      return "navigator geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    console.log(position);
    // return { long: position.coords.longitude, lat: position.coords.latitude }
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
    return;
  }

  async function fetchWeather() {
    console.log(lat, long);
    await weatherData(long, lat).then((e) => {
      let hourlyTemps = e.hourly.data.map((e) => e.temperature);
      setTmp(Math.round(e.currently.temperature));
      setTmpHigh(Math.round(Math.max(...hourlyTemps)));
      setTmpLow(Math.round(Math.min(...hourlyTemps)));
      setComment(e.currently.summery);
      setcity(e.timezone);
      setDate(dateFunc(e.currently.time * 1000));
    });
  }

  useEffect(() => {
    dateFunc();
    getLocation();
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [lat, long]);

  useEffect(() => {
    if (tempType == "f") {
      setTmp(celsiusToFahrenheit(tmp));
      setTmpHigh(celsiusToFahrenheit(tmpHigh));
      setTmpLow(celsiusToFahrenheit(tmpLow));
    } else if (tempType == "c") {
      setTmp(fahrenheitToCelsius(tmp));
      setTmpHigh(fahrenheitToCelsius(tmpHigh));
      setTmpLow(fahrenheitToCelsius(tmpLow));
    }
  }, [tempType]);

  return (
    <div
      className="container d-flex flex-column justify-content-around"
      style={{
        background: `url(${bkg}) center center / cover no-repeat`,
        minHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <div className="row">
        <div className="col h3">INSTAWEATHER</div>
        <div className="col">
          <div className="row w-50 m-auto">
            <div
              className={
                "col" + (tempType == "c" ? " active bg-secondary" : "")
              }
              onClick={() => setTempType("c")}
            >
              C
            </div>
            <div
              className={
                "col" + (tempType == "f" ? " active bg-secondary" : "")
              }
              onClick={() => setTempType("f")}
            >
              F
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h1>{city}</h1>
          <div>{date}</div>
          <img src={wIcon} style={{ width: "50px" }} alt="" />
        </div>
        <div className="col">
          <h1>{tmp}</h1>
          <div className="row w-50 m-auto">
            <div className="col">{tmpHigh}</div>
            <div className="col">/</div>
            <div className="col">{tmpLow}</div>
          </div>
          <div>{comment}</div>
        </div>
      </div>
      {/* <div>
        <div className="row">
          <div>Hourly</div>
          <div>Daily</div>
        </div>
        <div className="row">data....</div>
      </div> */}
      <div className="row"></div>
    </div>
  );
}

function dateFunc(date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date(date);
  return monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
}

const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

const fahrenheitToCelsius = (fahrenheit) =>
  Math.round(((fahrenheit - 32) * 5) / 9);
