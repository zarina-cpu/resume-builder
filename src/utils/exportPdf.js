import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const CAPTURE_TIMEOUT_MS = 45_000

/** Tailwind 4 injects oklch() — strip app styles in clone so only resume CSS applies */
function prepareCloneForExport(clonedDoc, clonedElement) {
  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => node.remove())

  const style = clonedDoc.createElement('style')
  style.textContent = `
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background:#fff; }
    .resume-palette-slate { --resume-accent:#334155;--resume-accent-light:#64748b;--resume-muted:#94a3b8;--resume-border:#e2e8f0;--resume-bg:#fff;--resume-text:#0f172a;--resume-accent-soft:#f1f5f9; }
    .resume-palette-ocean { --resume-accent:#0369a1;--resume-accent-light:#0284c7;--resume-muted:#64748b;--resume-border:#bae6fd;--resume-bg:#fff;--resume-text:#0c4a6e;--resume-accent-soft:#e0f2fe; }
    .resume-palette-forest { --resume-accent:#166534;--resume-accent-light:#22c55e;--resume-muted:#6b7280;--resume-border:#bbf7d0;--resume-bg:#fff;--resume-text:#14532d;--resume-accent-soft:#ecfdf5; }
    .resume-palette-burgundy { --resume-accent:#881337;--resume-accent-light:#be123c;--resume-muted:#78716c;--resume-border:#fecdd3;--resume-bg:#fff;--resume-text:#4c0519;--resume-accent-soft:#fff1f2; }
    .resume-sheet { background:var(--resume-bg); color:var(--resume-text); }
    .flex { display:flex; } .flex-col { flex-direction:column; } .flex-wrap { flex-wrap:wrap; }
    .flex-1 { flex:1; } .shrink-0 { flex-shrink:0; } .items-start { align-items:flex-start; }
    .justify-between { justify-content:space-between; } .justify-center { justify-content:center; }
    .gap-2 { gap:0.5rem; } .gap-3 { gap:0.75rem; } .gap-4 { gap:1rem; } .gap-6 { gap:1.5rem; }
    .grid { display:grid; } .space-y-1 > * + * { margin-top:0.25rem; } .space-y-4 > * + * { margin-top:1rem; }
    .space-y-5 > * + * { margin-top:1.25rem; } .space-y-8 > * + * { margin-top:2rem; }
    .p-6 { padding:1.5rem; } .p-8 { padding:2rem; } .p-10 { padding:2.5rem; } .px-2\\.5 { padding-left:0.625rem;padding-right:0.625rem; }
    .py-1 { padding-top:0.25rem;padding-bottom:0.25rem; } .pb-6 { padding-bottom:1.5rem; } .mb-2 { margin-bottom:0.5rem; }
    .mb-3 { margin-bottom:0.75rem; } .mb-4 { margin-bottom:1rem; } .mb-6 { margin-bottom:1.5rem; } .mb-8 { margin-bottom:2rem; }
    .mb-10 { margin-bottom:2.5rem; } .mb-12 { margin-bottom:3rem; } .mt-1 { margin-top:0.25rem; } .mt-2 { margin-top:0.5rem; }
    .mt-3 { margin-top:0.75rem; } .mt-4 { margin-top:1rem; } .mt-6 { margin-top:1.5rem; } .mt-8 { margin-top:2rem; }
    .mx-auto { margin-left:auto;margin-right:auto; } .text-center { text-align:center; }
    .text-xs { font-size:0.75rem;line-height:1rem; } .text-sm { font-size:0.875rem;line-height:1.25rem; }
    .text-base { font-size:1rem;line-height:1.5rem; } .text-lg { font-size:1.125rem;line-height:1.75rem; }
    .text-xl { font-size:1.25rem;line-height:1.75rem; } .text-3xl { font-size:1.875rem;line-height:2.25rem; }
    .text-4xl { font-size:2.25rem;line-height:2.5rem; } .font-medium { font-weight:500; } .font-semibold { font-weight:600; }
    .font-bold { font-weight:700; } .font-light { font-weight:300; } .uppercase { text-transform:uppercase; }
    .italic { font-style:italic; } .leading-tight { line-height:1.25; } .leading-relaxed { line-height:1.625; }
    .leading-loose { line-height:2; } .tracking-wider { letter-spacing:0.05em; } .tracking-widest { letter-spacing:0.1em; }
    .tracking-tight { letter-spacing:-0.025em; } .tracking-\\[0\\.2em\\] { letter-spacing:0.2em; }
    .border { border-width:1px;border-style:solid; } .border-b { border-bottom-width:1px;border-bottom-style:solid; }
    .rounded-full { border-radius:9999px; } .rounded-lg { border-radius:0.5rem; } .rounded-sm { border-radius:0.125rem; }
    .overflow-hidden { overflow:hidden; } .object-cover { object-fit:cover; } .aspect-square { aspect-ratio:1/1; }
    .w-full { width:100%; } .w-20 { width:5rem; } .w-24 { width:6rem; } .h-20 { height:5rem; } .h-24 { height:6rem; }
    .max-w-2xl { max-width:42rem; } .max-w-xl { max-width:36rem; } .list-disc { list-style-type:disc; }
    .list-inside { list-style-position:inside; } .inline-block { display:inline-block; } .break-all { word-break:break-all; }
    .opacity-75 { opacity:0.75; } .opacity-80 { opacity:0.8; } .opacity-90 { opacity:0.9; }
    .sm\\:flex-row { flex-direction:row; } .md\\:flex-row { flex-direction:row; } .md\\:w-56 { width:14rem; } .md\\:p-10 { padding:2.5rem; } .md\\:p-14 { padding:3.5rem; }
    .chip-soft { background:var(--resume-accent-soft); border-color:var(--resume-border); color:var(--resume-accent); }
    .text-white { color:#ffffff !important; }
    .resume-sidebar, .resume-sidebar * { color:#ffffff !important; }
    .resume-sidebar span { color:#ffffff !important; }
    .block { display:block; }
    .resume-export-root { box-shadow:none !important; margin:0 !important; background:#fff; width:794px !important; max-width:794px !important; }
    .resume-sheet { width:794px !important; max-width:794px !important; min-height:auto !important; }
  `
  clonedDoc.head.appendChild(style)

  if (clonedElement) {
    clonedElement.style.boxShadow = 'none'
    clonedElement.style.margin = '0'
    clonedElement.style.background = '#ffffff'
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Создание PDF заняло слишком много времени. Попробуйте ещё раз.')),
        ms,
      )
    }),
  ])
}

function pauseAppStylesheets() {
  const paused = []
  document.querySelectorAll('link[rel="stylesheet"], style[data-vite-dev-id]').forEach((node) => {
    if (node.tagName === 'LINK') {
      if (!node.disabled) {
        node.disabled = true
        paused.push(node)
      }
    } else {
      node.setAttribute('data-pdf-paused', 'true')
      node.media = 'not all'
      paused.push(node)
    }
  })
  return paused
}

function resumeAppStylesheets(paused) {
  paused.forEach((node) => {
    if (node.tagName === 'LINK') {
      node.disabled = false
    } else {
      node.media = ''
      node.removeAttribute('data-pdf-paused')
    }
  })
}

async function captureElement(element) {
  const exportWidth = Number(element.dataset.exportWidth) || 794

  const sandbox = document.createElement('div')
  sandbox.setAttribute('aria-hidden', 'true')
  sandbox.style.cssText = `position:fixed;left:0;top:0;width:${exportWidth}px;opacity:0;pointer-events:none;z-index:-1;background:#fff;`
  const clone = element.cloneNode(true)
  clone.style.width = `${exportWidth}px`
  clone.style.maxWidth = `${exportWidth}px`
  clone.style.transform = 'none'

  const sheet = clone.querySelector('.resume-sheet')
  if (sheet) {
    sheet.style.width = `${exportWidth}px`
    sheet.style.maxWidth = `${exportWidth}px`
  }

  sandbox.appendChild(clone)
  document.body.appendChild(sandbox)

  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })

  const exportHeight = Math.ceil(
    Math.max(clone.scrollHeight, clone.offsetHeight, sheet?.scrollHeight || 0),
  )

  const pausedStyles = pauseAppStylesheets()

  try {
    return await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      width: exportWidth,
      height: exportHeight,
      windowWidth: exportWidth,
      windowHeight: exportHeight,
      onclone: (clonedDoc, clonedElement) => {
        prepareCloneForExport(clonedDoc, clonedElement)
      },
    })
  } finally {
    resumeAppStylesheets(pausedStyles)
    sandbox.remove()
  }
}

export async function exportPdf(element, fileName = 'resume.pdf') {
  if (!element) throw new Error('Нет элемента для экспорта')

  await document.fonts.ready

  const canvas = await withTimeout(captureElement(element), CAPTURE_TIMEOUT_MS)

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(fileName)
}
