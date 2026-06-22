import React, { useMemo } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Stack } from '@mui/material';

// Generic, date-driven academic term windows. No course data is required —
// this reflects where "today" falls inside a typical Spring / Summer / Fall
// term, so the indicator is always real and never a placeholder value.
function getCurrentTerm(today) {
  const year = today.getFullYear();
  const terms = [
    { name: 'Spring Semester', start: new Date(year, 0, 8), end: new Date(year, 4, 16) },
    { name: 'Summer Term', start: new Date(year, 5, 1), end: new Date(year, 6, 31) },
    { name: 'Fall Semester', start: new Date(year, 7, 18), end: new Date(year, 11, 19) },
  ];
  return terms.find((t) => today >= t.start && today <= t.end) || terms[2];
}

export default function SemesterProgress() {
  const { label, percent, daysLeft } = useMemo(() => {
    const today = new Date();
    const term = getCurrentTerm(today);
    const totalMs = term.end - term.start;
    const elapsedMs = today - term.start;
    const pct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
    const remainingDays = Math.max(0, Math.ceil((term.end - today) / (1000 * 60 * 60 * 24)));
    return { label: term.name, percent: pct, daysLeft: remainingDays };
  }, []);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif" }}>
            {label} Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {daysLeft} days left
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ height: 10, borderRadius: 6 }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {percent}% of the term completed
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
