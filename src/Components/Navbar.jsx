import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useCourses } from '../context/CourseContext.jsx';
import QuickAddDialog from './QuickAddDialog.jsx';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/courses': 'Course Management',
  '/timetable': 'Timetable Planner',
  '/conflicts': 'Conflict Detection',
  '/summary': 'Semester Summary',
};

export default function Navbar({ onMenuClick, darkMode, onToggleDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { conflicts } = useCourses();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] || 'University Course Planner';

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' }, mr: 1 }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ fontFamily: "'Lora', serif", fontWeight: 600, flexGrow: 1 }}
          >
            {title}
          </Typography>

          <Tooltip title="Quick add course">
            <IconButton color="primary" onClick={() => setQuickAddOpen(true)} aria-label="Quick add course">
              <AddCircleRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={conflicts.length > 0 ? `${conflicts.length} conflicts detected` : 'No conflicts'}>
            <IconButton onClick={() => navigate('/conflicts')} aria-label="View conflicts">
              <Badge badgeContent={conflicts.length} color="error" max={99}>
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={onToggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <QuickAddDialog open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
}
