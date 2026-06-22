import { useMemo, useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Snackbar, Alert, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { getAppTheme } from './theme/theme';
import { useCourses } from './Context/CourseContext.jsx';
import Navbar from './Components/Navbar.jsx';
import Sidebar, { SIDEBAR_WIDTH } from './Components/Sidebar.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Course from './Pages/Course.jsx';
import Timetable from './Pages/Timetable.jsx';

import Conflict from './Pages/Conflict.jsx';
import Summary from './Pages/Summary.jsx';

function NotFoundRoute() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        That page doesn't exist inside the planner.
      </Typography>
      <Button variant="contained" href="#/" sx={{ mt: 2 }}>
        Back to Dashboard
      </Button>
    </Box>
  );
}

export default function App() {
  const { settings, toggleDarkMode, snackbar, closeSnackbar } = useCourses();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useMemo(() => getAppTheme(settings.darkMode ? 'dark' : 'light'), [
    settings.darkMode,
  ]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Navbar
            onMenuClick={handleDrawerToggle}
            darkMode={settings.darkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Course />} />



              <Route path="/timetable" element={<Timetable />} />
              <Route path="/conflicts" element={<Conflict />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
