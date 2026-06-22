import React from 'react';
import { Box, Alert, AlertTitle, Stack, Grid, Card, CardContent, Typography } from '@mui/material';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useCourses } from '../context/CourseContext.jsx';
import EmptyState from './EmptyState.jsx';

const TYPE_META = {
  TIME_CONFLICT: { label: 'Time Conflicts', icon: ScheduleRoundedIcon, color: '#d32f2f' },
  CLASSROOM_CONFLICT: { label: 'Classroom Conflicts', icon: MeetingRoomRoundedIcon, color: '#ed6c02' },
  DUPLICATE_COURSE: { label: 'Duplicate Courses', icon: ContentCopyRoundedIcon, color: '#9c27b0' },
  CREDIT_OVERLOAD: { label: 'Credit Overload', icon: TrendingUpRoundedIcon, color: '#d32f2f' },
};

function WarningCards({ conflicts }) {
  const counts = conflicts.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {Object.entries(TYPE_META).map(([type, meta]) => {
        const Icon = meta.icon;
        const count = counts[type] || 0;
        return (
          <Grid item xs={12} sm={6} md={3} key={type}>
            <Card sx={{ opacity: count > 0 ? 1 : 0.55 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon sx={{ color: meta.color }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {meta.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default function ConflictPanel({ compact = false, maxItems = null }) {
  const { conflicts } = useCourses();
  const visibleConflicts = maxItems ? conflicts.slice(0, maxItems) : conflicts;

  if (conflicts.length === 0) {
    return (
      <EmptyState
        title="No conflicts detected"
        description="Your schedule is clean — no time, classroom, duplicate, or credit-overload conflicts found."
      />
    );
  }

  return (
    <Box>
      {!compact && <WarningCards conflicts={conflicts} />}
      <Stack spacing={1.5}>
        {visibleConflicts.map((conflict) => (
          <Alert key={conflict.id} severity={conflict.severity} variant="outlined">
            <AlertTitle sx={{ fontWeight: 700 }}>
              {TYPE_META[conflict.type]?.label || conflict.type}
            </AlertTitle>
            {conflict.message}
          </Alert>
        ))}
      </Stack>
    </Box>
  );
}
