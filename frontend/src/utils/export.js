import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCost, formatDate } from './tokens';

export function exportCSV(requests, userName) {
  const headers = ['Date', 'Prompt', 'Model', 'Provider', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Cost ($)', 'Grade'];
  const rows = requests.map(r => [
    new Date(r.createdAt).toISOString(),
    `"${(r.prompt || '').replace(/"/g, '""').slice(0, 100)}"`,
    r.model, r.provider, r.inputTokens, r.outputTokens, r.totalTokens,
    r.cost.toFixed(6), r.efficiencyGrade
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `tokentrack-export-${Date.now()}.csv`);
}

export function exportPDF(requests, userName, summary) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('TokenTrack — Usage Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated for: ${userName}`, 14, 28);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);

  if (summary) {
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Requests: ${summary.count}  |  Total Tokens: ${summary.tokens}  |  Total Cost: ${formatCost(summary.cost)}`, 14, 44);
  }

  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Model', 'Provider', 'Tokens', 'Cost', 'Grade']],
    body: requests.slice(0, 200).map(r => [
      formatDate(r.createdAt), r.model, r.provider,
      r.totalTokens.toLocaleString(), formatCost(r.cost), r.efficiencyGrade
    ]),
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9 },
  });

  doc.save(`tokentrack-report-${Date.now()}.pdf`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
