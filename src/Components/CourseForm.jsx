import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { DEPARTMENTS, SEMESTERS } from '../utils/constants.js';
import { courseColorPalette } from '../theme/theme.js';
import { useCourses } from '../context/CourseContext.jsx';

const EMPTY_COURSE = {
  code: '',
  name: '',
  department: '',
  instructor: '',
  credits: '',
  semester: '',
  classroom: '',
  color: courseColorPalette[0],
};

export default function CourseForm({
  initialValues = null,
  onSubmit,
  onCancel,
  submitLabel = 'Add Course',
}) {
  const { isDuplicateCode } = useCourses();
  const [values, setValues] = useState(initialValues || EMPTY_COURSE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues || EMPTY_COURSE);
    setErrors({});
  }, [initialValues]);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!values.code?.trim()) nextErrors.code = 'Course code is required.';
    if (!values.name?.trim()) nextErrors.name = 'Course name is required.';
    if (!values.department) nextErrors.department = 'Department is required.';
    if (!values.instructor?.trim()) nextErrors.instructor = 'Instructor is required.';
    if (!values.semester) nextErrors.semester = 'Semester is required.';
    if (!values.classroom?.trim()) nextErrors.classroom = 'Classroom is required.';

    const creditsNum = Number(values.credits);
    if (values.credits === '' || values.credits === null || values.credits === undefined) {
      nextErrors.credits = 'Credits are required.';
    } else if (Number.isNaN(creditsNum) || creditsNum <= 0) {
      nextErrors.credits = 'Credits must be a positive number.';
    }

    if (
      values.code?.trim() &&
      isDuplicateCode(values.code.trim(), initialValues?.id || null)
    ) {
      nextErrors.code = `Course code "${values.code}" already exists.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...values,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      instructor: values.instructor.trim(),
      classroom: values.classroom.trim(),
      credits: Number(values.credits),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Course Code"
            placeholder="e.g. CS101"
            fullWidth
            value={values.code}
            onChange={handleChange('code')}
            error={!!errors.code}
            helperText={errors.code}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Course Name"
            placeholder="e.g. Introduction to Programming"
            fullWidth
            value={values.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Department"
            fullWidth
            value={values.department}
            onChange={handleChange('department')}
            error={!!errors.department}
            helperText={errors.department}
          >
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instructor"
            placeholder="e.g. Dr. Sarah Lin"
            fullWidth
            value={values.instructor}
            onChange={handleChange('instructor')}
            error={!!errors.instructor}
            helperText={errors.instructor}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Credits"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            value={values.credits}
            onChange={handleChange('credits')}
            error={!!errors.credits}
            helperText={errors.credits}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Semester"
            fullWidth
            value={values.semester}
            onChange={handleChange('semester')}
            error={!!errors.semester}
            helperText={errors.semester}
          >
            {SEMESTERS.map((sem) => (
              <MenuItem key={sem} value={sem}>
                {sem}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Classroom"
            placeholder="e.g. Room 204"
            fullWidth
            value={values.classroom}
            onChange={handleChange('classroom')}
            error={!!errors.classroom}
            helperText={errors.classroom}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Color Tag
          </Typography>
          <Stack direction="row" spacing={1.25} flexWrap="wrap">
            {courseColorPalette.map((color) => (
              <Box
                key={color}
                component="button"
                type="button"
                onClick={() => setValues((prev) => ({ ...prev, color }))}
                aria-label={`Select color ${color}`}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: values.color === color ? '3px solid' : '1px solid',
                  borderColor: values.color === color ? 'text.primary' : 'divider',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0,
                }}
              >
                {values.color === color && (
                  <CheckRoundedIcon sx={{ color: '#fff', fontSize: 16 }} />
                )}
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
