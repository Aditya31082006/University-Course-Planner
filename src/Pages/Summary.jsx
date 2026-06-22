import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import ExportButtons from '../Components/ExportButtons.jsx';
import EmptyState from '../Components/EmptyState.jsx';
import { useCourses } from '../context/CourseContext.jsx';

function DistributionCard({ title, data, color }) {
  const entries = Object.entries(data);
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif", mb: 1.5 }}>
          {title}
        </Typography>
        {entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No data yet.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {entries
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <Stack key={name} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {name}
                  </Typography>
                  <Chip label={count} size="small" sx={{ bgcolor: color, color: '#fff', fontWeight: 700 }} />
                </Stack>
              ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default function Summary() {
  const { courses, stats } = useCourses();

  const statRows = [
    ['Total Credits', stats.totalCredits],
    ['Courses Count', stats.totalCourses],
    ['Weekly Classes', stats.weeklyClasses],
    ['Conflicts Detected', stats.conflictCount],
    ['Semester GPA Target', stats.gpaTarget],
    ['Study Hours / Week', `${stats.totalStudyHours}h`],
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
            Semester Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A full snapshot of your academic statistics, ready to export.
          </Typography>
        </Box>
        <ExportButtons />
      </Stack>

      {courses.length === 0 ? (
        <EmptyState
          title="Nothing to summarize yet"
          description="Add a few courses to generate your semester statistics and export them."
        />
      ) : (
        <>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif", mb: 2 }}>
                Academic Statistics
              </Typography>
              <Grid container spacing={2}>
                {statRows.map(([label, value]) => (
                  <Grid item xs={6} sm={4} key={label}>
                    <Typography variant="h6" fontWeight={700}>
                      {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ mb: 2.5 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <DistributionCard title="Department Distribution" data={stats.byDepartment} color="#1976d2" />
            </Grid>
            <Grid item xs={12} md={6}>
              <DistributionCard title="Instructor Distribution" data={stats.byInstructor} color="#42a5f5" />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
