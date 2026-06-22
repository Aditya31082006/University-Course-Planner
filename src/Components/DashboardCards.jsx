import React from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import StackedLineChartRoundedIcon from '@mui/icons-material/StackedLineChartRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SummaryCard from './SummaryCard.jsx';
import { useCourses } from '../context/CourseContext.jsx';
import { tokens } from '../theme/theme.js';

export default function DashboardCards() {
  const { stats } = useCourses();
  const theme = useTheme();

  const cards = [
    {
      icon: <MenuBookRoundedIcon />,
      label: 'Total Courses',
      value: stats.totalCourses,
      color: theme.palette.primary.main,
    },
    {
      icon: <StackedLineChartRoundedIcon />,
      label: 'Total Credits',
      value: stats.totalCredits,
      color: theme.palette.secondary.main,
    },
    {
      icon: <CalendarMonthRoundedIcon />,
      label: 'Weekly Classes',
      value: stats.weeklyClasses,
      color: '#2e7d32',
    },
    {
      icon: <ReportProblemRoundedIcon />,
      label: 'Conflicts Detected',
      value: stats.conflictCount,
      color: stats.conflictCount > 0 ? theme.palette.error.main : '#2e7d32',
    },
    {
      icon: <EmojiEventsRoundedIcon />,
      label: 'Semester GPA Target',
      value: stats.gpaTarget,
      color: tokens.accent,
      decimals: 1,
    },
    {
      icon: <AccessTimeRoundedIcon />,
      label: 'Study Hours / Week',
      value: stats.totalStudyHours,
      color: '#5e35b1',
      suffix: 'h',
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.label}>
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
