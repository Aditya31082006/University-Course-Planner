import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports the given courses (and optional summary stats) as a CSV file.
 */
export function exportCoursesToCSV(courses, filename = 'course-summary.csv') {
  const headers = [
    'Course Code',
    'Course Name',
    'Department',
    'Instructor',
    'Credits',
    'Semester',
    'Classroom',
  ];

  const rows = courses.map((c) => [
    c.code,
    c.name,
    c.department,
    c.instructor,
    c.credits,
    c.semester,
    c.classroom,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');

  // BOM so Excel opens UTF-8 correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/**
 * Exports a semester summary (stats + course list) as a formatted PDF.
 */
export function exportSummaryToPDF(courses, stats, filename = 'semester-summary.pdf') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginLeft = 40;
  let cursorY = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(25, 118, 210);
  doc.text('University Course Planner', marginLeft, cursorY);

  cursorY += 22;
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text('Semester Summary', marginLeft, cursorY);

  cursorY += 10;
  doc.setDrawColor(66, 165, 245);
  doc.setLineWidth(1);
  doc.line(marginLeft, cursorY, 555, cursorY);

  cursorY += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(`Generated on ${new Date().toLocaleString()}`, marginLeft, cursorY);

  cursorY += 24;
  const statLines = [
    ['Total Courses', stats.totalCourses],
    ['Total Credits', stats.totalCredits],
    ['Weekly Classes', stats.weeklyClasses],
    ['Conflicts Detected', stats.conflictCount],
    ['Semester GPA Target', stats.gpaTarget],
    ['Total Study Hours / week', stats.totalStudyHours],
  ];

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  statLines.forEach(([label, value], idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = marginLeft + col * 260;
    const y = cursorY + row * 20;
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), x + 150, y);
  });

  cursorY += Math.ceil(statLines.length / 2) * 20 + 20;

  autoTable(doc, {
    startY: cursorY,
    head: [['Code', 'Course Name', 'Department', 'Instructor', 'Credits', 'Semester', 'Room']],
    body: courses.map((c) => [
      c.code,
      c.name,
      c.department,
      c.instructor,
      c.credits,
      c.semester,
      c.classroom,
    ]),
    headStyles: { fillColor: [25, 118, 210], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: marginLeft, right: 40 },
    theme: 'striped',
  });

  doc.save(filename);
}
