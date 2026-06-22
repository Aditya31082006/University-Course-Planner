import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Stack } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.jsx';
import EmptyState from './EmptyState.jsx';

export default function CourseTable({ courses, onEdit, onDelete }) {
  const [pendingDelete, setPendingDelete] = useState(null);

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Add your first course or adjust your search and filters."
      />
    );
  }

  const columns = [
    {
      field: 'color',
      headerName: '',
      width: 16,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: params.value,
            mt: 1.7,
          }}
        />
      ),
    },
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Course Name', flex: 1, minWidth: 180 },
    { field: 'department', headerName: 'Department', width: 170 },
    { field: 'instructor', headerName: 'Instructor', width: 160 },
    { field: 'credits', headerName: 'Credits', width: 90, type: 'number' },
    { field: 'semester', headerName: 'Semester', width: 120 },
    { field: 'classroom', headerName: 'Room', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit course">
            <IconButton size="small" onClick={() => onEdit(params.row)} aria-label="Edit course">
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete course">
            <IconButton
              size="small"
              color="error"
              onClick={() => setPendingDelete(params.row)}
              aria-label="Delete course"
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={courses}
        columns={columns}
        disableRowSelectionOnClick
        density="comfortable"
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'code', sort: 'asc' }] },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete course?"
        description={
          pendingDelete
            ? `"${pendingDelete.code} — ${pendingDelete.name}" will be removed along with its timetable entries. This cannot be undone.`
            : ''
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          onDelete(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </Box>
  );
}
