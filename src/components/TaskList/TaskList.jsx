import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Divider,
  Autocomplete
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Check as CheckIcon, 
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import WeatherInfo from '../WeatherInfo/WeatherInfo';

const TaskList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Redux state
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Local state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [hasOutdoorTask, setHasOutdoorTask] = useState(false);
  const [location, setLocation] = useState('London');
  const [locationInput, setLocationInput] = useState('');

  // Popular cities for suggestions
  const popularCities = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Berlin',
    'Sydney',
    'Mumbai',
    'Dubai',
    'Toronto',
    'Singapore'
  ];

  // Check for outdoor tasks whenever tasks change
  useEffect(() => {
    if (tasks.some(task => 
      task.text.toLowerCase().includes('outdoor') || 
      task.text.toLowerCase().includes('outside') ||
      task.text.toLowerCase().includes('park') ||
      task.text.toLowerCase().includes('garden')
    )) {
      setHasOutdoorTask(true);
    } else {
      setHasOutdoorTask(false);
    }
  }, [tasks]);

  // Fetch tasks on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'FETCH_TASKS' });
    }
  }, [isAuthenticated, dispatch]);

  // Handler functions
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
  };

  const saveEdit = (task) => {
    const updatedTask = { ...task, text: editedText };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const handlePriorityChange = (task, newPriority) => {
    const updatedTask = { ...task, priority: newPriority };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'active' && task.completed) return false;
    
    // Filter by search term
    if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading tasks: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Location and Search Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} alignItems="center">
          {/* Location Selector */}
          <Autocomplete
            freeSolo
            options={popularCities}
            value={location}
            onChange={(event, newValue) => {
              if (newValue) setLocation(newValue);
            }}
            inputValue={locationInput}
            onInputChange={(event, newInputValue) => {
              setLocationInput(newInputValue);
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Weather Location" 
                variant="outlined"
                fullWidth
                helperText="Set location for weather info"
              />
            )}
            sx={{ flex: 2 }}
          />

          {/* Search Field */}
          <TextField
            label="Search tasks"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: 3 }}
          />

          {/* Filter Dropdown */}
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Weather Info Section */}
      {process.env.REACT_APP_WEATHER_API_KEY && hasOutdoorTask && (
        <WeatherInfo city={location} />
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No tasks found. {searchTerm ? 'Try a different search term.' : 'Add a task to get started!'}
        </Typography>
      ) : (
        <List>
          {filteredTasks.map(task => (
            <React.Fragment key={task.id}>
              <ListItem 
                sx={{ 
                  bgcolor: task.completed ? 'action.hover' : 'background.paper',
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                {/* Complete Checkbox */}
                <IconButton 
                  edge="start" 
                  onClick={() => handleComplete(task)}
                  color={task.completed ? "success" : "default"}
                >
                  <CheckIcon />
                </IconButton>

                {/* Task Text - Either editable or static */}
                {editingTaskId === task.id ? (
                  <TextField
                    fullWidth
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task)}
                    autoFocus
                    variant="standard"
                  />
                ) : (
                  <ListItemText
                    primary={task.text}
                    secondary={`Created: ${new Date(task.createdAt).toLocaleString()}`}
                    sx={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      mr: 2
                    }}
                  />
                )}

                <ListItemSecondaryAction>
                  {/* Priority Chip */}
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    sx={{ mr: 1 }}
                  />

                  {/* Priority Select - Only when editing */}
                  {editingTaskId === task.id && (
                    <FormControl size="small" sx={{ mr: 1, minWidth: 100 }}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={task.priority}
                        label="Priority"
                        onChange={(e) => handlePriorityChange(task, e.target.value)}
                      >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {/* Edit/Save Controls */}
                  {editingTaskId === task.id ? (
                    <>
                      <IconButton edge="end" onClick={() => saveEdit(task)}>
                        <SaveIcon color="primary" />
                      </IconButton>
                      <IconButton edge="end" onClick={cancelEdit}>
                        <CloseIcon color="error" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton 
                      edge="end" 
                      onClick={() => startEditing(task)}
                      disabled={task.completed}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

                  {/* Delete Button */}
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDelete(task.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TaskList;