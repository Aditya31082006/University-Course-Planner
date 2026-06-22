import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AcademicCalendarWidget() {
  const theme = useTheme();
  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthLabel = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif", mb: 1.5 }}>
          {monthLabel}
        </Typography>

        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          {WEEKDAY_LABELS.map((d, idx) => (
            <Grid item xs={12 / 7} key={`${d}-${idx}`}>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                {d}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={0.5}>
          {cells.map((day, idx) => {
            const isToday = day === today.getDate();
            return (
              <Grid item xs={12 / 7} key={idx}>
                <Box
                  sx={{
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    fontSize: 11.5,
                    fontWeight: isToday ? 700 : 400,
                    bgcolor: isToday ? theme.palette.primary.main : 'transparent',
                    color: isToday ? '#fff' : day ? 'text.primary' : 'transparent',
                  }}
                >
                  {day || '0'}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
