import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "emotion-theming";
import useWeatherAPI from "./useWeatherAPI.js";
import WeatherCard from "./WeatherCard.js";
import WeatherSetting from "./WeatherSetting.js";
import sunriseAndSunsetData from "./sunrise-sunset.json";


const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const theme = {
  light: {
    backgroundColor: "#cecece",
    foregroundColor: "#f4f4f4",
    boxShadow: "0 1px 3px 0 #555",
    titleColor: "#222",
    temperatureColor: "#757575",
    textColor: "#828282",
    switchBgColor: "white",
    switchTextColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9f9",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
    switchBgColor: "#121416",
    switchTextColor: "#f9f9f9"
  }
};
const getMoment = locationName => {
  const location = sunriseAndSunsetData.find(data => {
    return (data.locationName = locationName);
  });
  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");
  const date = location.time.find(data => {
    return (data.dataTime = nowDate);
  });

  const sunriseTimestamp = new Date(
    `${date.dataTime} ${date.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(`${date.dataTime} ${date.sunset}`).getTime();
  const nowTimeStamp = now.getTime();
  return nowTimeStamp < sunsetTimestamp && nowTimeStamp > sunriseTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  console.log("--- invoke function component ---");
  const [chosenTheme, setChosenTheme] = useState("dark");
  const [weatherElement, fetchData] = useWeatherAPI();
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const { locationName } = weatherElement;
  const [currentLocation, setCurrentLocation] = useState(locationName);
  const moment = useMemo(() => getMoment(locationName), [locationName]);

  useEffect(() => {
    setChosenTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  const switchTheme = () => {
    console.log("switch");
    setChosenTheme(chosenTheme === "dark" ? "light" : "dark");
  };
  
  useEffect(() => {
    console.log("execute function in useEffect");
    fetchData();
  }, [fetchData]);

  return (
    <ThemeProvider theme={theme[chosenTheme]}>
      <Container>
      {currentPage == 'WeatherCard' && (
              <WeatherCard 
                weatherElement={weatherElement}
                moment={moment}
                switchTheme={switchTheme}
                chosenTheme={chosenTheme}
                fetchData={fetchData} 
                setCurrentPage={setCurrentPage}
              />)
      }
      {currentPage == 'WeatherSetting' && (
        <WeatherSetting 
          setCurrentPage={setCurrentPage} 
          setCurrentLocation={setCurrentLocation}/>
          )
      }
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;