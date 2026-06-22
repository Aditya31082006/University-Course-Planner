import React, { useMemo, useState } from 'react';
import { Box, Stack, Button, TextField, MenuItem, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchBar from '../Components/SearchBar.jsx';
import CourseTable from '../Components/CourseTable.jsx';
import CourseDialog from '../Components/CourseDialog.jsx';
import { useCourses } from '../context/CourseContext.jsx';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants';

export default function Courses() {
  const { courses, deleteCourse } = useCourses();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesSearch =
        !term ||
        c.code.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term) ||
        c.instructor.toLowerCase().includes(term);
      const matchesDept = departmentFilter === 'All' || c.department === departmentFilter;
      const matchesSemester = semesterFilter === 'All' || c.semester === semesterFilter;
      return matchesSearch && matchesDept && matchesSemester;
    });
  }, [courses, search, departmentFilter, semesterFilter]);

  const openAddDialog = () => {
    setEditingCourse(null);
    setDialogOpen(true);
  };

  const openEditDialog = (course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Typography variant="h5" sx={{ fontFamily: "'Lora', serif", fontWeight: 700 }}>
          Course Management
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAddDialog}>
          Add Course
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by code, name, instructor…" />
        <TextField
          select
          size="small"
          label="Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All Departments</MenuItem>
          {DEPARTMENTS.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Semester"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="All">All Semesters</MenuItem>
          {SEMESTERS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <CourseTable courses={filteredCourses} onEdit={openEditDialog} onDelete={deleteCourse} />

      <CourseDialog open={dialogOpen} onClose={() => setDialogOpen(false)} course={editingCourse} />
    </Box>
  );
}
