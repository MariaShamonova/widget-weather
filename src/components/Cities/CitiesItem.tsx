import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import './styles.scss';
import cursor from './images/cursor.png';
import barometer from './images/weather/barometer.png';

interface WindType {
  speed: number;
}
interface MainType {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}
interface WeatherType {
  id: number;
  main: string;
  description: string;
  icon: string;
}
interface SysType {
  country: string;
  sunrise: number;
  sunset: number;
}
interface CoordType {
  lat: number;
  lon: number;
}
export interface WeatherDataType {
  id: number;
  name: string;
  weather: WeatherType[];
  main: MainType;
  wind: WindType;
  visibility: number;
}

type AppProps = {
  data: WeatherDataType;
  key: number;
};

const CitiesItem: FunctionComponent<AppProps> = ({ data }) => {
  const {
    id,
    name,
    wind: { speed },
    main: { temp, feels_like, humidity, pressure },
    visibility,
  } = data;

  const [icon, setIcon] = useState<string>('');

  const capitalFirstSymbol = (text: string) => {
    return text[0].toUpperCase() + text.slice(1);
  };

  let emptyString = '';
  const description = data !== null ? data.weather.map((el) => emptyString.concat(capitalFirstSymbol(el.description) + '. ')) : '';

  const setIconName = (iconName: string) => {
    switch (iconName) {
      case 'Clouds': {
        return 'clouds';
      }
      case 'Rain': {
        return 'rain';
      }
      case 'Clear': {
        return 'sun';
      }
      case 'Mist': {
        return 'mist';
      }
      case 'Fog': {
        return 'mist';
      }
      case 'Snow': {
        return 'snow';
      }
      case 'Thunder': {
        return 'thunder';
      }
      case 'Storm': {
        return 'storm';
      }
      case 'Tornado': {
        return 'tornado';
      }
      case 'Wind': {
        return 'wind';
      }
      default: {
        return 'thermometer-1';
      }
    }
  };

  const nameImage = setIconName(data.weather[0].main);

  useEffect(() => {
    (async () => {
      try {
        const importedIcon = await import(`./images/weather/${nameImage}`);
        setIcon(importedIcon.default);
      } catch {
        const importedIcon = await import(`./images/weather/${nameImage}.png`);
        setIcon(importedIcon.default);
      }
    })();
  }, []);

  return (
    <div className="cities-item">
      <div className="cities-item__elem cities-item__title">{data !== null ? data.name : '???'}</div>
      <div className="cities-item__elem cities-item__temperature">
        <div className="temperature__item image">
          <img src={icon} alt="" width="45" />
        </div>
        <div className="temperature__item text">
          {data !== null ? temp : '???'}
          &#186;
        </div>
      </div>
      <div className="cities-item__elem cities-item__description">
        Feels like {data !== null ? feels_like : '???'}. &#186;C &nbsp;
        {description}
      </div>
      <div className="cities-item__elem cities-item__speed-wind">
        <div className="speed-wind__item">
          <div className="icon">
            <img src={cursor} alt="" />
          </div>
          <div className="text">
            {data !== null
              ? speed.toLocaleString('ru', {
                  minimumFractionDigits: 1,
                })
              : '???'}
            m/s
          </div>
        </div>
        <div className="speed-wind__item">
          <div className="icon">
            <img src={barometer} alt="" width="16" />
          </div>
          <div className="text">{data !== null ? pressure : '???'} hPa</div>
        </div>
      </div>
      <div className="cities-item__elem cities-item__humidity">Humidity: {data !== null ? humidity : '???'}%</div>
      <div className="cities-item__elem cities-item__visibility">Visibility: {data !== null ? visibility : '???'} km</div>
    </div>
  );
};
export default CitiesItem;
