import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useCourses } from '../context/CourseContext.jsx';
import { courseColorPalette } from '../theme/theme.js';
import { DAYS } from '../utils/constants.js';

function ChartCard({ title, children, isEmpty, emptyText }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: "'Lora', serif" }} gutterBottom>
          {title}
        </Typography>
        {isEmpty ? (
          <Box
            sx={{
              height: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {emptyText}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 260 }}>{children}</Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatisticsCharts() {
  const { stats } = useCourses();

  const creditsData = Object.entries(stats.creditsByDepartment).map(([name, value]) => ({
    name,
    value,
  }));

  const coursesByDeptData = Object.entries(stats.byDepartment).map(([name, value]) => ({
    name,
    courses: value,
  }));

  const weeklyClassData = DAYS.map((day) => ({
    day: day.slice(0, 3),
    classes: stats.classesByDay[day] || 0,
  }));

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={4}>
        <ChartCard
          title="Credits Distribution"
          isEmpty={creditsData.length === 0}
          emptyText="Add courses to see credit distribution by department."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={creditsData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
              >
                {creditsData.map((entry, index) => (
                  <Cell key={entry.name} fill={courseColorPalette[index % courseColorPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <ChartCard
          title="Courses by Department"
          isEmpty={coursesByDeptData.length === 0}
          emptyText="Add courses to see them grouped by department."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coursesByDeptData} margin={{ top: 8, right: 8, left: -16, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="courses" fill="#1976d2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <ChartCard
          title="Weekly Class Count"
          isEmpty={stats.weeklyClasses === 0}
          emptyText="Assign courses on the timetable to see your weekly class load."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyClassData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="classes" fill="#42a5f5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
