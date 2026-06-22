import { MAX_SEMESTER_CREDITS } from './constants';

/**
 * Builds a lookup of courseId -> course for fast access.
 */
function indexCourses(courses) {
  const map = new Map();
  courses.forEach((c) => map.set(c.id, c));
  return map;
}

/**
 * Detects two entries placed on the same day + time slot but belonging to
 * different courses.
 */
export function detectTimeConflicts(entries, courseMap) {
  const conflicts = [];
  const buckets = new Map(); // key: day|slot -> entries[]

  entries.forEach((entry) => {
    const key = `${entry.day}|${entry.timeSlot}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(entry);
  });

  buckets.forEach((bucketEntries, key) => {
    const distinctCourseIds = new Set(bucketEntries.map((e) => e.courseId));
    if (distinctCourseIds.size > 1) {
      const [day, timeSlot] = key.split('|');
      const courseNames = bucketEntries
        .map((e) => courseMap.get(e.courseId)?.code || 'Unknown')
        .join(' vs ');
      conflicts.push({
        id: `time-${key}`,
        type: 'TIME_CONFLICT',
        severity: 'error',
        message: `Time conflict on ${day} at ${timeSlot}: ${courseNames} are scheduled at the same time.`,
        entryIds: bucketEntries.map((e) => e.id),
        day,
        timeSlot,
      });
    }
  });

  return conflicts;
}

/**
 * Detects two entries placed in the same classroom on the same day + time
 * slot, even if they belong to different... rooms shared by accident.
 */
export function detectClassroomConflicts(entries, courseMap) {
  const conflicts = [];
  const buckets = new Map(); // key: day|slot|classroom -> entries[]

  entries.forEach((entry) => {
    const course = courseMap.get(entry.courseId);
    const classroom = course?.classroom?.trim();
    if (!classroom) return;
    const key = `${entry.day}|${entry.timeSlot}|${classroom.toLowerCase()}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(entry);
  });

  buckets.forEach((bucketEntries, key) => {
    const distinctCourseIds = new Set(bucketEntries.map((e) => e.courseId));
    if (distinctCourseIds.size > 1) {
      const [day, timeSlot, classroom] = key.split('|');
      const courseNames = bucketEntries
        .map((e) => courseMap.get(e.courseId)?.code || 'Unknown')
        .join(' vs ');
      conflicts.push({
        id: `room-${key}`,
        type: 'CLASSROOM_CONFLICT',
        severity: 'warning',
        message: `Classroom conflict in ${classroom.toUpperCase()} on ${day} at ${timeSlot}: ${courseNames} share the same room.`,
        entryIds: bucketEntries.map((e) => e.id),
        day,
        timeSlot,
      });
    }
  });

  return conflicts;
}

/**
 * Flags duplicate course codes (defensive — the add-course form already
 * blocks this, but data can be imported or edited).
 */
export function detectDuplicateCourses(courses) {
  const conflicts = [];
  const seen = new Map();

  courses.forEach((course) => {
    const code = course.code?.trim().toUpperCase();
    if (!code) return;
    if (!seen.has(code)) seen.set(code, []);
    seen.get(code).push(course);
  });

  seen.forEach((group, code) => {
    if (group.length > 1) {
      conflicts.push({
        id: `dup-${code}`,
        type: 'DUPLICATE_COURSE',
        severity: 'warning',
        message: `Course code "${code}" is used by ${group.length} courses. Each course should have a unique code.`,
        entryIds: group.map((c) => c.id),
      });
    }
  });

  return conflicts;
}

/**
 * Flags a semester credit overload, i.e. total credits across all courses
 * exceeds the maximum allowed (30).
 */
export function detectCreditOverload(courses) {
  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  if (totalCredits > MAX_SEMESTER_CREDITS) {
    return [
      {
        id: 'credit-overload',
        type: 'CREDIT_OVERLOAD',
        severity: 'error',
        message: `Credit overload: ${totalCredits} credits exceed the maximum of ${MAX_SEMESTER_CREDITS} credits allowed per semester.`,
        entryIds: courses.map((c) => c.id),
      },
    ];
  }
  return [];
}

/**
 * Runs every detector and returns one combined, de-duplicated list of
 * conflict objects ready to render in alerts / panels.
 */
export function detectAllConflicts(courses, entries) {
  const courseMap = indexCourses(courses);
  return [
    ...detectTimeConflicts(entries, courseMap),
    ...detectClassroomConflicts(entries, courseMap),
    ...detectDuplicateCourses(courses),
    ...detectCreditOverload(courses),
  ];
}
