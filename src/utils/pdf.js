// Ekstrak teks dari berkas PDF memakai pdf.js (berjalan lokal di peramban)
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'

export async function extractTextFromPdf(file) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let out = ''
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    out += content.items.map((it) => it.str).join(' ') + '\n'
  }
  return { text: out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(), pages: pdf.numPages }
}
