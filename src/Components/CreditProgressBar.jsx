import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Stack, Box } from '@mui/material';
import { useCourses } from '../context/CourseContext.jsx';
import { MAX_SEMESTER_CREDITS } from '../utils/constants.js';

export default function CreditProgressBar() {
  const { stats } = useCourses();
  const percent = Math.min(100, Math.round((stats.totalCredits / MAX_SEMESTER_CREDITS) * 100));
  const isOverloaded = stats.totalCredits > MAX_SEMESTER_CREDITS;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif" }}>
            Credit Load
          </Typography>
          <Typography variant="body2" color={isOverloaded ? 'error.main' : 'text.secondary'} fontWeight={700}>
            {stats.totalCredits} / {MAX_SEMESTER_CREDITS}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percent}
          color={isOverloaded ? 'error' : 'primary'}
          sx={{ height: 10, borderRadius: 6 }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color={isOverloaded ? 'error.main' : 'text.secondary'}>
            {isOverloaded
              ? `${stats.totalCredits - MAX_SEMESTER_CREDITS} credits over the recommended maximum`
              : `${MAX_SEMESTER_CREDITS - stats.totalCredits} credits of headroom remaining`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
