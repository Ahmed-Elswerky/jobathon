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
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [city, setcity] = useState("city placeholder");
  const [date, setDate] = useState(0);
  //   console.log(weatherData());
  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      return "navigator geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    console.log(position);
    // return { long: position.coords.longitude, lat: position.coords.latitude }
    setLong(position.coords.longitude);
    setLat(position.coords.latitude);
  }

  async function weatherData() {
    console.log(lat, long);
    let res = await fetch(
      `https://api.darksky.net/forecast/a177f8481c31fa96c3f95ad4f4f84610/${lat},${long}`,
      {
        method: "GET",
        mode: "no-cors",
        headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'no-cors'
        }
      }
    )
    console.log(typeof res,res.body, "-------------------");
  }
  useEffect(() => {
    dateFunc();
  }, []);
  useEffect(() => {
    weatherData();
  }, [lat, long]);
  function dateFunc() {
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

    const d = new Date();
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    setDate(
      monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear()
    )
    setInterval(
      () =>
        setDate(
          monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear()
        ),
      1000 * 60 * 60 * 24
    );
  }
  return (
    <div
      className="row"
      style={{
        background: `url(${bkg}) center center / cover no-repeat`,
        height: "100vh",
      }}
    >
      <div className="row">
        <div className="col">INSTAWEATHER</div>
        <div className="col">
          <div className="row">
            <div className={"col" +( tempType == "c" ? " active bg-secondary":'')} onClick={()=>setTempType('c')}>C</div>
            <div className={"col" +( tempType == "f" ? " active bg-secondary":'')} onClick={()=>setTempType('f')}>F</div>
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
