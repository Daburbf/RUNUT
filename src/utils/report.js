// Susun berkas PDF hasil pemeriksaan memakai jsPDF (murni sisi klien)
import { jsPDF } from 'jspdf'

const M = { l: 18, r: 18, t: 22 }

function header(d, title) {
  d.setFillColor(0, 0, 0)
  d.rect(0, 0, 210, 14, 'F')
  d.setTextColor(255, 48, 0)
  d.setFont('helvetica', 'bold')
  d.setFontSize(11)
  d.text('RUNUT', M.l, 9)
  d.setTextColor(255, 255, 255)
  d.setFontSize(8)
  d.text('HASIL PEMERIKSAAN TULISAN', 210 - M.r, 9, { align: 'right' })
  d.setTextColor(0, 0, 0)
  d.setFontSize(18)
  const lines = d.splitTextToSize(title, 210 - M.l - M.r)
  d.text(lines, M.l, M.t + 6)
  return M.t + 6 + lines.length * 8 + 2
}

function meta(d, y, rows) {
  d.setFontSize(9)
  d.setTextColor(100, 100, 100)
  d.setFont('helvetica', 'normal')
  rows.forEach((r) => {
    const lines = d.splitTextToSize(r, 210 - M.l - M.r)
    d.text(lines, M.l, y)
    y += lines.length * 5
  })
  d.setDrawColor(0, 0, 0)
  d.setLineWidth(0.6)
  d.line(M.l, y + 2, 210 - M.r, y + 2)
  return y + 10
}

function section(d, y, head, body) {
  const need = (arr) => arr.length * 5 + 12
  const write = (yy, h, arr) => {
    if (yy + need(arr) > 287) { d.addPage(); yy = M.t }
    d.setFont('helvetica', 'bold')
    d.setFontSize(11)
    d.setTextColor(255, 48, 0)
    d.text(h.toUpperCase(), M.l, yy)
    yy += 7
    d.setFont('helvetica', 'normal')
    d.setFontSize(10)
    d.setTextColor(0, 0, 0)
    arr.forEach((ln) => {
      if (yy > 287) { d.addPage(); yy = M.t }
      d.text(ln, M.l, yy)
      yy += 5
    })
    return yy + 6
  }
  const arr = d.splitTextToSize(body, 210 - M.l - M.r)
  return write(y, head, arr)
}

export function buildResultPdf({ title, dateStr, stats, issuesSummary, revised }) {
  const d = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = header(d, title)
  y = meta(d, y, [dateStr, stats])
  y = section(d, y, 'Ringkasan Temuan', issuesSummary)
  section(d, y, 'Hasil Revisi', revised)
  const n = d.getNumberOfPages()
  for (let i = 1; i <= n; i++) {
    d.setPage(i)
    d.setFontSize(8)
    d.setTextColor(140, 140, 140)
    d.text(`Halaman ${i} dari ${n}`, 210 - M.r, 292, { align: 'right' })
  }
  return d.output('blob')
}
