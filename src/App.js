import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import TaskInput from './components/TaskInput/TaskInput';
import TaskList from './components/TaskList/TaskList';
import Login from './components/Auth/Login';
import WeatherInfo from './components/WeatherInfo/WeatherInfo';

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { tasks } = useSelector(state => state.tasks);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'FETCH_TASKS' });
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Advanced To-Do App
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {isAuthenticated && (
          <>
            <TaskInput />
            {tasks.some(task => task.text.toLowerCase().includes('outdoor')) && (
              <WeatherInfo city="London" /> 
            )}
            <TaskList />
          </>
        )}
      </Container>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;