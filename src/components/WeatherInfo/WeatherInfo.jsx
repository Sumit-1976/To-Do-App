import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Typography, CircularProgress } from '@mui/material';

const WeatherInfo = ({ city }) => {
  const dispatch = useDispatch();
  const { weatherData, loading, error } = useSelector(state => state.weather);

  useEffect(() => {
    if (city && process.env.REACT_APP_WEATHER_API_KEY) {
      dispatch({ type: 'FETCH_WEATHER', payload: city });
    }
  }, [city, dispatch]);

  if (!process.env.REACT_APP_WEATHER_API_KEY) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Weather features disabled - API key not configured
      </Alert>
    );
  }

  if (loading) return <CircularProgress size={24} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!weatherData) return null;

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6">Weather in {weatherData.name}</Typography>
      <Typography>Temperature: {weatherData.main.temp}°C</Typography>
      <Typography>Humidity: {weatherData.main.humidity}%</Typography>
      <Typography>Conditions: {weatherData.weather[0].description}</Typography>
    </Box>
  );
};

export default WeatherInfo;