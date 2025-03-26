import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 5000
});

export const fetchWeather = (city) => {
  return api.get(`/weather?q=${city}&appid=${API_KEY}&units=metric`);
};