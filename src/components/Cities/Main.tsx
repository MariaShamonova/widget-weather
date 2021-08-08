import React, { useState, useEffect } from "react";
import WidgetWeather from "./WidgetWeather";
import preloader from "./images/preloader.gif";
import axios from "axios";
import { WeatherDataType } from "./CitiesItem";

function Main() {
  const apiKey = "bdf8194cb2aa74ffc6a004548c775541";
  const [data, setData] = useState<WeatherDataType[]>([]);
  const [errorRequest, setErrorRequest] = useState<boolean>(false);
  const [accessGeoData, setAccessGeoData] = useState<boolean>(true);

  const loader = (
    <div
      className="preloader__wrapper"
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={preloader} alt="preload" width={50} height={50} />
    </div>
  );

  useEffect(() => {
    findCoordinates();
  }, []);

  const findCoordinates = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const api = await axios(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`,
            );

            setData([api.data]);
          } catch {
            setErrorRequest(true);
          }
        },
        () => {
          setAccessGeoData(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    } else {
    }
  };

  const ErrorComponent = () => {
    return <div>Error Request</div>;
  };
  const MainComponent = () => {
    return data.length === 0 && accessGeoData ? loader : <WidgetWeather currWeather={data} />;
  };

  return <>{!errorRequest ? <MainComponent /> : <ErrorComponent />}</>;
}

export default Main;
