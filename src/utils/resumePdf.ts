/**
 * Generates a standards-compliant single-page PDF resume in pure TypeScript
 * and triggers an immediate browser download (`Ch_Thrimurthi_Resume.pdf`).
 */
export function downloadResumePdf(): void {
  const lines: Array<{ text: string; size: number; y: number; bold?: boolean }> = [
    { text: 'CH. THRIMURTHI', size: 20, y: 748, bold: true },
    { text: 'NIAT Student Specializing in AI  |  BTech CSE (AI & ML), Joy University', size: 10.5, y: 730 },
    {
      text: 'Email: choparathrimurthi@gmail.com  |  LinkedIn: linkedin.com/in/thrimurthi-choppara-752005412',
      size: 9,
      y: 713,
    },
    { text: 'PROFILE', size: 12, y: 682, bold: true },
    {
      text: "I'm a NIAT student specializing in AI and a first-year Computer Science student exploring",
      size: 10,
      y: 665,
    },
    {
      text: 'Artificial Intelligence, Machine Learning, and Software Development. Passionate about',
      size: 10,
      y: 651,
    },
    {
      text: 'learning new technologies and transforming creative ideas into practical solutions.',
      size: 10,
      y: 637,
    },
    { text: 'EDUCATION', size: 12, y: 604, bold: true },
    {
      text: 'BTech - Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
      size: 10.5,
      y: 587,
      bold: true,
    },
    { text: 'Joy University · NIAT AI Track  |  2026 - 2030 (Current: Year 1)', size: 9.5, y: 572 },
    {
      text: 'Coursework: Problem Solving with Python, Web Foundations, Discrete Mathematics, AI Intro',
      size: 9.5,
      y: 557,
    },
    { text: 'TECHNICAL SKILLS', size: 12, y: 524, bold: true },
    {
      text: 'Languages & Web:  Python, JavaScript, HTML5, CSS3',
      size: 10,
      y: 507,
    },
    {
      text: 'AI & Engineering: Artificial Intelligence, Machine Learning Foundations, Git & GitHub',
      size: 10,
      y: 492,
    },
    { text: 'SELECTED PROJECTS', size: 12, y: 458, bold: true },
    { text: '1. Smart SOS Emergency Alert System', size: 10.5, y: 440, bold: true },
    {
      text: 'Rapid distress signal & real-time location alert workflow designed for immediate safety response.',
      size: 9.5,
      y: 425,
    },
    { text: 'Stack: Python, JavaScript, HTML, CSS, Geolocation API', size: 9, y: 411 },
    { text: '2. Food Waste Management System', size: 10.5, y: 386, bold: true },
    {
      text: 'Surplus food tracking and redistribution platform connecting donors with local communities.',
      size: 9.5,
      y: 371,
    },
    { text: 'Stack: HTML, CSS, JavaScript, Python, Git & GitHub', size: 9, y: 357 },
    { text: '3. Personal Portfolio Website', size: 10.5, y: 332, bold: true },
    {
      text: 'Interactive 3D developer portfolio built with React, Three.js, React Three Fiber, and Tailwind CSS.',
      size: 9.5,
      y: 317,
    },
    { text: 'Stack: React, Three.js, React Three Fiber, TypeScript, Tailwind CSS', size: 9, y: 303 },
    { text: 'HACKATHONS & MILESTONES', size: 12, y: 269, bold: true },
    {
      text: 'Participated in several hackathons, collaborating in sprint teams to prototype and pitch',
      size: 9.5,
      y: 252,
    },
    {
      text: 'AI, safety, and web software solutions while pursuing applied ML certifications.',
      size: 9.5,
      y: 238,
    },
  ];

  const escapePdfText = (value: string) =>
    value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const streamCommands = [
    '0.08 0.08 0.14 RG',
    '1 w',
    '54 700 m 558 700 l S',
    '54 624 m 558 624 l S',
    '54 544 m 558 544 l S',
    '54 478 m 558 478 l S',
    '54 289 m 558 289 l S',
  ];

  for (const line of lines) {
    const fontRef = line.bold ? '/F2' : '/F1';
    streamCommands.push(
      `BT ${fontRef} ${line.size} Tf 54 ${line.y} Td (${escapePdfText(line.text)}) Tj ET`,
    );
  }

  const contentStream = streamCommands.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Ch_Thrimurthi_Resume.pdf';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
