import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const TaskInput = () => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showWeatherPrompt, setShowWeatherPrompt] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const outdoorKeywords = ['outdoor', 'outside', 'park', 'garden', 'walk', 'hike'];
    const containsOutdoor = outdoorKeywords.some(keyword => 
      taskText.toLowerCase().includes(keyword)
    );
    setShowWeatherPrompt(containsOutdoor);
  }, [taskText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      const newTask = {
        id: uuidv4(),
        text: taskText,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setTaskText('');
      setPriority('Medium');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Add a new task"
          variant="outlined"
          fullWidth
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          helperText="Mention 'outdoor' to get weather info"
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          disabled={!taskText.trim()}
        >
          Add
        </Button>
      </Box>

      {showWeatherPrompt && !process.env.REACT_APP_WEATHER_API_KEY && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Weather information unavailable - API key not configured
        </Alert>
      )}
    </Box>
  );
};

export default TaskInput;