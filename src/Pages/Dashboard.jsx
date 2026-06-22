import React, { useState } from 'react';
import { Box, Typography, Grid, Fab, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DashboardCards from '../Components/DashboardCards.jsx';
import StatisticsCharts from '../Components/StatisticsCharts.jsx';
import SemesterProgress from '../Components/SemesterProgress.jsx';
import CreditProgressBar from '../Components/CreditProgressBar.jsx';
import AcademicCalendarWidget from '../Components/AcademicCalenderWidget.jsx';
import ConflictPanel from '../Components/ConflictPanel.jsx';
import QuickAddDialog from '../Components/QuickAddDialog.jsx';
import { useCourses } from '../context/CourseContext.jsx';

export default function Dashboard() {
  const { conflicts } = useCourses();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, mb: 0.5 }}>
        Welcome back 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Here's how your semester is shaping up.
      </Typography>

      <DashboardCards />

      <Grid container spacing={2.5} sx={{ mt: 2.5 }}>
        <Grid item xs={12} md={4}>
          <SemesterProgress />
        </Grid>
        <Grid item xs={12} md={4}>
          <CreditProgressBar />
        </Grid>
        <Grid item xs={12} md={4}>
          <AcademicCalendarWidget />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, mb: 1.5 }}>
          Statistics
        </Typography>
        <StatisticsCharts />
      </Box>

      {conflicts.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Lora', serif", fontWeight: 700, mb: 1.5 }}>
            Recent Conflicts
          </Typography>
          <ConflictPanel compact maxItems={3} />
        </Box>
      )}

      <Tooltip title="Quick add course">
        <Fab
          color="primary"
          onClick={() => setQuickAddOpen(true)}
          sx={{ position: 'fixed', bottom: 28, right: 28 }}
          aria-label="Quick add course"
        >
          <AddRoundedIcon />
        </Fab>
      </Tooltip>

      <QuickAddDialog open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </Box>
  );
}
