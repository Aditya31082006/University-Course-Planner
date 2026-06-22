import React from 'react';
import CourseDialog from './CourseDialog.jsx';

// Thin alias kept as its own component so the navbar / dashboard FAB can
// import a clearly-named "quick add" entry point, while the actual add/edit
// implementation lives once in CourseDialog.
export default function QuickAddDialog({ open, onClose }) {
  return <CourseDialog open={open} onClose={onClose} course={null} />;
}
