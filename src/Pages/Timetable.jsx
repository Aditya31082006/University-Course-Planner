import React from 'react';
import { Box, Typography } from '@mui/material';
import TimetableGrid from '../Components/TimetableGrid.jsx';

export default function Timetable() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, mb: 0.5 }}>
        Timetable Planner
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Build your weekly schedule by dragging courses onto the grid.
      </Typography>
      <TimetableGrid />
    </Box>
  );
}
