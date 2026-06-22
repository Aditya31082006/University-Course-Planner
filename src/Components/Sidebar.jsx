import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import { useCourses } from '../context/CourseContext.jsx';

export const SIDEBAR_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: DashboardRoundedIcon },
  { label: 'Courses', path: '/courses', icon: MenuBookRoundedIcon },
  { label: 'Timetable', path: '/timetable', icon: CalendarMonthRoundedIcon },
  { label: 'Conflicts', path: '/conflicts', icon: ReportProblemRoundedIcon },
  { label: 'Summary', path: '/summary', icon: SummarizeRoundedIcon },
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { conflicts } = useCourses();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 2.75 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <SchoolIcon fontSize="small" />
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle1" fontFamily="'Lora', serif" fontWeight={700} noWrap>
            Course Planner
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            University Edition
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 1.5, py: 1.5 }}>
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          const conflictBadge = path === '/conflicts' && conflicts.length > 0;
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(path);
                  onNavigate?.();
                }}
                sx={{
                  borderRadius: '12px',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: 14 }}
                />
                {conflictBadge && (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 20,
                      px: 0.5,
                      borderRadius: '10px',
                      bgcolor: isActive ? 'rgba(255,255,255,0.25)' : 'error.main',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {conflicts.length}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Stored locally on this device
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <SidebarContent onNavigate={onClose} />
    </Drawer>
  );
}
