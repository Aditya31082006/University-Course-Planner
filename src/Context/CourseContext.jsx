import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from '../utils/Storage';
import { detectAllConflicts } from '../utils/conflictDetection';
import {
  DEFAULT_GPA_TARGET,
  STUDY_HOURS_PER_CREDIT,
} from '../utils/constants';
import { courseColorPalette } from '../theme/theme';

const CourseContext = createContext(null);

const DEFAULT_SETTINGS = {
  darkMode: false,
  gpaTarget: DEFAULT_GPA_TARGET,
};

function makeId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState(() => loadFromStorage(STORAGE_KEYS.COURSES, []));
  const [timetableEntries, setTimetableEntries] = useState(() =>
    loadFromStorage(STORAGE_KEYS.TIMETABLE, [])
  );
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Persist on every change ------------------------------------------------
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TIMETABLE, timetableEntries);
  }, [timetableEntries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Course CRUD -------------------------------------------------------------
  const isDuplicateCode = useCallback(
    (code, ignoreId = null) =>
      courses.some(
        (c) => c.id !== ignoreId && c.code.trim().toLowerCase() === code.trim().toLowerCase()
      ),
    [courses]
  );

  const addCourse = useCallback(
    (courseInput) => {
      if (isDuplicateCode(courseInput.code)) {
        showSnackbar(`Course code "${courseInput.code}" already exists.`, 'error');
        return { success: false, error: 'DUPLICATE_CODE' };
      }
      const newCourse = {
        id: makeId('course'),
        color: courseInput.color || courseColorPalette[courses.length % courseColorPalette.length],
        ...courseInput,
      };
      setCourses((prev) => [...prev, newCourse]);
      showSnackbar(`Course "${newCourse.code}" added successfully.`, 'success');
      return { success: true, course: newCourse };
    },
    [courses.length, isDuplicateCode, showSnackbar]
  );

  const updateCourse = useCallback(
    (id, updates) => {
      if (updates.code && isDuplicateCode(updates.code, id)) {
        showSnackbar(`Course code "${updates.code}" already exists.`, 'error');
        return { success: false, error: 'DUPLICATE_CODE' };
      }
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      showSnackbar('Course updated successfully.', 'success');
      return { success: true };
    },
    [isDuplicateCode, showSnackbar]
  );

  const deleteCourse = useCallback(
    (id) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setTimetableEntries((prev) => prev.filter((e) => e.courseId !== id));
      showSnackbar('Course removed.', 'info');
    },
    [showSnackbar]
  );

  // Timetable CRUD ----------------------------------------------------------
  const addTimetableEntry = useCallback(
    (courseId, day, timeSlot) => {
      const alreadyExists = timetableEntries.some(
        (e) => e.courseId === courseId && e.day === day && e.timeSlot === timeSlot
      );
      if (alreadyExists) {
        showSnackbar('This course is already placed in that slot.', 'warning');
        return { success: false };
      }
      const entry = { id: makeId('entry'), courseId, day, timeSlot };
      setTimetableEntries((prev) => [...prev, entry]);
      return { success: true, entry };
    },
    [timetableEntries, showSnackbar]
  );

  const moveTimetableEntry = useCallback((entryId, day, timeSlot) => {
    setTimetableEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, day, timeSlot } : e))
    );
  }, []);

  const removeTimetableEntry = useCallback((entryId) => {
    setTimetableEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  // Settings ------------------------------------------------------------------
  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const setGpaTarget = useCallback((value) => {
    setSettings((prev) => ({ ...prev, gpaTarget: value }));
  }, []);

  // Derived statistics --------------------------------------------------------
  const conflicts = useMemo(
    () => detectAllConflicts(courses, timetableEntries),
    [courses, timetableEntries]
  );

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    const weeklyClasses = timetableEntries.length;
    const totalStudyHours = totalCredits * STUDY_HOURS_PER_CREDIT;

    const byDepartment = {};
    courses.forEach((c) => {
      byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
    });

    const byInstructor = {};
    courses.forEach((c) => {
      byInstructor[c.instructor] = (byInstructor[c.instructor] || 0) + 1;
    });

    const creditsByDepartment = {};
    courses.forEach((c) => {
      creditsByDepartment[c.department] =
        (creditsByDepartment[c.department] || 0) + (Number(c.credits) || 0);
    });

    const classesByDay = {};
    timetableEntries.forEach((e) => {
      classesByDay[e.day] = (classesByDay[e.day] || 0) + 1;
    });

    return {
      totalCourses,
      totalCredits,
      weeklyClasses,
      conflictCount: conflicts.length,
      gpaTarget: settings.gpaTarget,
      totalStudyHours,
      byDepartment,
      byInstructor,
      creditsByDepartment,
      classesByDay,
    };
  }, [courses, timetableEntries, conflicts.length, settings.gpaTarget]);

  const value = useMemo(
    () => ({
      courses,
      timetableEntries,
      settings,
      conflicts,
      stats,
      snackbar,
      addCourse,
      updateCourse,
      deleteCourse,
      isDuplicateCode,
      addTimetableEntry,
      moveTimetableEntry,
      removeTimetableEntry,
      toggleDarkMode,
      setGpaTarget,
      showSnackbar,
      closeSnackbar,
    }),
    [
      courses,
      timetableEntries,
      settings,
      conflicts,
      stats,
      snackbar,
      addCourse,
      updateCourse,
      deleteCourse,
      isDuplicateCode,
      addTimetableEntry,
      moveTimetableEntry,
      removeTimetableEntry,
      toggleDarkMode,
      setGpaTarget,
      showSnackbar,
      closeSnackbar,
    ]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return ctx;
}
