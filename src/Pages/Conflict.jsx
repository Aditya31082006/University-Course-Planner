import React from 'react';
import { Box, Typography } from '@mui/material';
import ConflictPanel from '../Components/ConflictPanel.jsx';

export default function Conflicts() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, mb: 0.5 }}>
        Conflict Detection
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Automatically detected time, classroom, duplicate, and credit-overload conflicts.
      </Typography>
      <ConflictPanel />
    </Box>
  );
}
