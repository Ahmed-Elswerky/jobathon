import React, { useEffect, useState } from "react";
import { weatherData, locationData } from "../data";
import bkg from "../assets/background.png";
import wIcon from "../assets/weather-icon.png";

function Item({ time, temp }) {
  return (
    <div className="d-inline-block m-2" style={{ minWidth: "100px" }}>
      <div className="card bg-transparent">
        <div className="card-body">
          <div className="col">{time}</div>
          <div className="col">
            <img src={wIcon} style={{ width: "50px" }} alt="" />
          </div>
          <div className="col">{temp}</div>
        </div>
      </div>
    </div>
  );
}

function ListItems({ data }) {
  console.log(data);
  return (
    <div className="w-auto d-flex flex-row overflow-auto p-5">
      {data.map((item, index) => (
        <Item temp={item.temp} time={item.time} />
      ))}
    </div>
  );
}

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
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [listType, setListType] = useState("hourly");
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
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
    return;
  }

  async function fetchWeather() {
    console.log(lat, long);
    await weatherData(long, lat).then((e) => {
      console.log(e);
      let hourlyTemps = e.hourly.map((e) => e.temp);
      setTmp(Math.round(e.current.temp));
      setTmpHigh(Math.round(Math.max(...hourlyTemps)));
      setTmpLow(Math.round(Math.min(...hourlyTemps)));
      setComment(
        e.current?.weather[0] != undefined
          ? e.current?.weather[0].description
          : "no weather summery in the used api"
      );
      setcity(e.timezone);
      setDate(dateFunc(e.current.dt * 1000));
      let hourlyData = e.hourly.map((e) => {
        let date1 = new Date(e.dt * 1000);
        let time = date1.getHours() + ":" + date1.getMinutes();
        return { temp: e.temp, time };
      });
      setHourly(hourlyData);
      let dailyData = e.daily.map((e) => {
        let time = new Date(e.dt * 1000);
        time = dateFunc(time);
        return { temp: e.temp.day, time };
      });
      setDaily(dailyData);
      console.log(hourlyData, dailyData);
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
      setDaily(daily.map((e) => ({ ...e, temp: celsiusToFahrenheit(e.temp) })));
      setHourly(
        hourly.map((e) => ({ ...e, temp: celsiusToFahrenheit(e.temp) }))
      );
    } else if (tempType == "c") {
      setTmp(fahrenheitToCelsius(tmp));
      setTmpHigh(fahrenheitToCelsius(tmpHigh));
      setTmpLow(fahrenheitToCelsius(tmpLow));
      setDaily(daily.map((e) => ({ ...e, temp: fahrenheitToCelsius(e.temp) })));
      setHourly(
        hourly.map((e) => ({ ...e, temp: fahrenheitToCelsius(e.temp) }))
      );
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
          <h1 className=" py-2">{city}</h1>
          <div className=" py-2">{date}</div>
          <img className=" py-2" src={wIcon} style={{ width: "50px" }} alt="" />
        </div>
        <div className="col">
          <h1 className=" py-2">{tmp}</h1>
          <div className="row w-50 m-auto  py-2">
            <div className="col">{tmpHigh}</div>
            <div className="col">/</div>
            <div className="col">{tmpLow}</div>
          </div>
          <div className=" py-2">{comment}</div>
        </div>
      </div>
      <div>
        <div className="row">
          <div
            className={
              "col" + (listType == "hourly" ? " active bg-secondary" : "")
            }
            onClick={() => setListType("hourly")}
          >
            Hourly
          </div>
          <div
            className={
              "col" + (listType == "daily" ? " active bg-secondary" : "")
            }
            onClick={() => setListType("daily")}
          >
            Daily
          </div>
        </div>
        <div className="row">
          <div>
            <ListItems data={listType == "hourly" ? hourly : daily} />
          </div>
        </div>
      </div>
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
