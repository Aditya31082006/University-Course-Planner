import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import { useCourses } from '../context/CourseContext.jsx';
import { DAYS, TIME_SLOTS } from '../utils/constants.js';
import EmptyState from './EmptyState.jsx';

const DRAG_TYPE = {
  NEW_COURSE: 'new-course',
  MOVE_ENTRY: 'move-entry',
};

export default function TimetableGrid() {
  const theme = useTheme();
  const { courses, timetableEntries, addTimetableEntry, moveTimetableEntry, removeTimetableEntry, conflicts } =
    useCourses();
  const [dragOverCell, setDragOverCell] = useState(null); // `${day}|${slot}`
  const [draggingCourseId, setDraggingCourseId] = useState(null);

  const courseMap = new Map(courses.map((c) => [c.id, c]));

  const conflictedEntryIds = new Set(
    conflicts.filter((c) => c.entryIds).flatMap((c) => c.entryIds)
  );

  const entriesFor = (day, slot) =>
    timetableEntries.filter((e) => e.day === day && e.timeSlot === slot);

  const handleDragStartCourse = (courseId) => (event) => {
    event.dataTransfer.setData('dragType', DRAG_TYPE.NEW_COURSE);
    event.dataTransfer.setData('courseId', courseId);
    setDraggingCourseId(courseId);
  };

  const handleDragStartEntry = (entryId) => (event) => {
    event.stopPropagation();
    event.dataTransfer.setData('dragType', DRAG_TYPE.MOVE_ENTRY);
    event.dataTransfer.setData('entryId', entryId);
  };

  const handleDragOver = (day, slot) => (event) => {
    event.preventDefault();
    setDragOverCell(`${day}|${slot}`);
  };

  const handleDrop = (day, slot) => (event) => {
    event.preventDefault();
    setDragOverCell(null);
    setDraggingCourseId(null);
    const dragType = event.dataTransfer.getData('dragType');

    if (dragType === DRAG_TYPE.NEW_COURSE) {
      const courseId = event.dataTransfer.getData('courseId');
      if (courseId) addTimetableEntry(courseId, day, slot);
    } else if (dragType === DRAG_TYPE.MOVE_ENTRY) {
      const entryId = event.dataTransfer.getData('entryId');
      if (entryId) moveTimetableEntry(entryId, day, slot);
    }
  };

  if (courses.length === 0) {
    return (
      <EmptyState
        title="Add courses first"
        description="Create at least one course in Course Management before building your timetable."
      />
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Drag a course onto a slot to schedule it. Drag a scheduled block to a new slot to
        reschedule it. Cells outlined in red have a conflict.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems="flex-start">
        {/* Available courses panel */}
        <Paper
          variant="outlined"
          sx={{ p: 2, width: { xs: '100%', md: 220 }, flexShrink: 0 }}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
            Courses
          </Typography>
          <Stack spacing={1}>
            {courses.map((course) => (
              <Chip
                key={course.id}
                draggable
                onDragStart={handleDragStartCourse(course.id)}
                onDragEnd={() => setDraggingCourseId(null)}
                icon={<DragIndicatorRoundedIcon fontSize="small" />}
                label={`${course.code}`}
                title={course.name}
                sx={{
                  justifyContent: 'flex-start',
                  bgcolor: alpha(course.color, 0.15),
                  color: course.color,
                  fontWeight: 700,
                  cursor: 'grab',
                  opacity: draggingCourseId === course.id ? 0.5 : 1,
                  border: `1px solid ${alpha(course.color, 0.4)}`,
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* Grid */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `90px repeat(${DAYS.length}, minmax(120px, 1fr))`,
              minWidth: 90 + DAYS.length * 120,
            }}
          >
            {/* Header row */}
            <Box />
            {DAYS.map((day) => (
              <Box
                key={day}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                {day}
              </Box>
            ))}

            {/* Time slot rows */}
            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot}>
                <Box
                  sx={{
                    p: 1,
                    fontSize: 11.5,
                    color: 'text.secondary',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {slot}
                </Box>
                {DAYS.map((day) => {
                  const cellEntries = entriesFor(day, slot);
                  const cellKey = `${day}|${slot}`;
                  const isOver = dragOverCell === cellKey;
                  const hasConflict = cellEntries.some((e) => conflictedEntryIds.has(e.id));

                  return (
                    <Box
                      key={cellKey}
                      onDragOver={handleDragOver(day, slot)}
                      onDragLeave={() => setDragOverCell((cur) => (cur === cellKey ? null : cur))}
                      onDrop={handleDrop(day, slot)}
                      sx={{
                        minHeight: 56,
                        p: 0.5,
                        border: `1px solid ${theme.palette.divider}`,
                        borderColor: hasConflict ? 'error.main' : theme.palette.divider,
                        bgcolor: isOver
                          ? alpha(theme.palette.primary.main, 0.08)
                          : hasConflict
                          ? alpha(theme.palette.error.main, 0.06)
                          : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        transition: 'background-color 120ms ease',
                      }}
                    >
                      {cellEntries.map((entry) => {
                        const course = courseMap.get(entry.courseId);
                        if (!course) return null;
                        return (
                          <Tooltip
                            key={entry.id}
                            title={`${course.name} • ${course.instructor} • Room ${course.classroom}`}
                          >
                            <Box
                              draggable
                              onDragStart={handleDragStartEntry(entry.id)}
                              sx={{
                                bgcolor: alpha(course.color, 0.18),
                                color: course.color,
                                border: `1px solid ${alpha(course.color, 0.45)}`,
                                borderRadius: '8px',
                                px: 0.75,
                                py: 0.4,
                                fontSize: 11.5,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'grab',
                                gap: 0.5,
                              }}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {course.code}
                              </span>
                              <IconButton
                                size="small"
                                sx={{ p: 0.1, color: 'inherit' }}
                                onClick={() => removeTimetableEntry(entry.id)}
                                aria-label={`Remove ${course.code} from ${day} ${slot}`}
                              >
                                <CloseRoundedIcon sx={{ fontSize: 13 }} />
                              </IconButton>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  );
                })}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
