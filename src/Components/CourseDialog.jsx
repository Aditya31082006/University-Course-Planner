import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CourseForm from './CourseForm.jsx';
import { useCourses } from '../context/CourseContext.jsx';

export default function CourseDialog({ open, onClose, course = null }) {
  const { addCourse, updateCourse } = useCourses();
  const isEdit = Boolean(course);

  const handleSubmit = (values) => {
    const result = isEdit ? updateCourse(course.id, values) : addCourse(values);
    if (result.success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "'Lora', serif" }}>
        {isEdit ? 'Edit Course' : 'Add New Course'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          aria-label="Close dialog"
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <CourseForm
          initialValues={course}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={isEdit ? 'Save Changes' : 'Add Course'}
        />
      </DialogContent>
    </Dialog>
  );
}
