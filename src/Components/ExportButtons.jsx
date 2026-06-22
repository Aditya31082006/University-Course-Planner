import React from 'react';
import { Stack, Button } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { useCourses } from '../context/CourseContext.jsx';
import { exportCoursesToCSV, exportSummaryToPDF } from '../utils/exportHelpers.js';

export default function ExportButtons() {
  const { courses, stats, showSnackbar } = useCourses();

  const handleExportCSV = () => {
    if (courses.length === 0) {
      showSnackbar('Add at least one course before exporting.', 'warning');
      return;
    }
    exportCoursesToCSV(courses);
    showSnackbar('CSV exported successfully.', 'success');
  };

  const handleExportPDF = () => {
    if (courses.length === 0) {
      showSnackbar('Add at least one course before exporting.', 'warning');
      return;
    }
    exportSummaryToPDF(courses, stats);
    showSnackbar('PDF exported successfully.', 'success');
  };

  return (
    <Stack direction="row" spacing={1.5}>
      <Button variant="outlined" startIcon={<FileDownloadRoundedIcon />} onClick={handleExportCSV}>
        Export CSV
      </Button>
      <Button variant="contained" startIcon={<PictureAsPdfRoundedIcon />} onClick={handleExportPDF}>
        Export PDF
      </Button>
    </Stack>
  );
}
