import { jsPDF } from 'jspdf'
import type { CanvasElement } from '../types/canvas'
import { renderElement, getElementBounds } from './renderElement'

export type ExportFormat = 'pdf' | 'png' | 'svg' | 'json'
export type PdfLayout = 'fit' | 'report' | 'presentation' | 'grid'
export type PdfPageSize = 'a4' | 'letter' | '16:9'
export type PdfThemeMode = 'light' | 'dark'

export interface ExportOptions {
  boardName: string
  elements: CanvasElement[]
  canvasWidth?: number
  canvasHeight?: number
  theme?: 'light' | 'dark'
  pdfLayout?: PdfLayout
  pdfPageSize?: PdfPageSize
  pdfThemeMode?: PdfThemeMode
  includeMetadata?: boolean
  includeLayerTable?: boolean
}

/**
 * Calculates the bounding box enclosing all elements with extra padding.
 */
function getContentBounds(elements: CanvasElement[], defaultW = 1200, defaultH = 800) {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: defaultW, height: defaultH }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const el of elements) {
    const b = getElementBounds(el)
    if (b) {
      minX = Math.min(minX, b.x)
      minY = Math.min(minY, b.y)
      maxX = Math.max(maxX, b.x + b.width)
      maxY = Math.max(maxY, b.y + b.height)
    }
  }

  if (minX === Infinity) {
    return { x: 0, y: 0, width: defaultW, height: defaultH }
  }

  const pad = 60
  return {
    x: Math.max(0, minX - pad),
    y: Math.max(0, minY - pad),
    width: Math.max(400, maxX - minX + pad * 2),
    height: Math.max(300, maxY - minY + pad * 2),
  }
}

/**
 * Creates an offscreen canvas rendering all elements at 2x scale for crisp export.
 */
function renderOffscreen(options: ExportOptions) {
  const { elements, theme = 'light' } = options
  const bounds = getContentBounds(elements)
  const scale = 2 // 2x high-resolution rendering

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(bounds.width * scale)
  canvas.height = Math.ceil(bounds.height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Fill background
  ctx.fillStyle = theme === 'dark' ? '#0f1117' : '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Scale and translate to crop around content
  ctx.scale(scale, scale)
  ctx.translate(-bounds.x, -bounds.y)

  // Render each element
  for (const el of elements) {
    renderElement(ctx, el, false)
  }

  return { canvas, bounds }
}

/**
 * Exports the workspace to a high-quality multi-format PDF document.
 */
export async function exportToPdf(options: ExportOptions): Promise<void> {
  const {
    boardName,
    elements,
    pdfLayout = 'report',
    pdfPageSize = 'a4',
    pdfThemeMode = 'light',
  } = options

  const offscreen = renderOffscreen({ ...options, theme: pdfThemeMode })
  if (!offscreen) return

  const { canvas, bounds } = offscreen
  const imgData = canvas.toDataURL('image/png', 1.0)
  const isLandscape = bounds.width >= bounds.height
  const sanitized = boardName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // ─────────────────────────────────────────────────────────────
  // 1. PRESENTATION SLIDE DECK (16:9 Widescreen)
  // ─────────────────────────────────────────────────────────────
  if (pdfLayout === 'presentation') {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [960, 540],
    })

    const pWidth = 960
    const pHeight = 540

    // Background fill
    pdf.setFillColor(pdfThemeMode === 'dark' ? 15 : 248, pdfThemeMode === 'dark' ? 17 : 250, pdfThemeMode === 'dark' ? 23 : 252)
    pdf.rect(0, 0, pWidth, pHeight, 'F')

    // Top Electric-Blue Accent Bar
    pdf.setFillColor(37, 99, 235)
    pdf.rect(0, 0, pWidth, 6, 'F')

    // Presentation Header Bar
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.setTextColor(pdfThemeMode === 'dark' ? 248 : 15, pdfThemeMode === 'dark' ? 250 : 23, pdfThemeMode === 'dark' ? 252 : 42)
    pdf.text(boardName, 44, 38)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(148, 163, 184)
    pdf.text(`Buildly Architecture Deck • ${dateStr} • ${elements.length} elements`, 44, 54)

    // Center diagram
    const topMargin = 70
    const bottomMargin = 40
    const sideMargin = 44
    const availW = pWidth - sideMargin * 2
    const availH = pHeight - topMargin - bottomMargin

    const imgAspect = bounds.width / bounds.height
    const availAspect = availW / availH

    let renderW = availW
    let renderH = availW / imgAspect
    if (imgAspect < availAspect) {
      renderH = availH
      renderW = availH * imgAspect
    }

    const posX = sideMargin + (availW - renderW) / 2
    const posY = topMargin + (availH - renderH) / 2

    // Border frame
    pdf.setDrawColor(pdfThemeMode === 'dark' ? 51 : 226, pdfThemeMode === 'dark' ? 65 : 232, pdfThemeMode === 'dark' ? 85 : 240)
    pdf.setLineWidth(1)
    pdf.rect(posX - 4, posY - 4, renderW + 8, renderH + 8)

    pdf.addImage(imgData, 'PNG', posX, posY, renderW, renderH, undefined, 'FAST')

    // Presentation Footer
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Buildly Whiteboard Studio • Think together. Build together.', sideMargin, pHeight - 16)
    pdf.text('Slide 1 of 1', pWidth - sideMargin - 50, pHeight - 16)

    pdf.save(`buildly_presentation_${sanitized}.pdf`)
    return
  }

  // ─────────────────────────────────────────────────────────────
  // 2. EXECUTIVE ARCHITECTURE REPORT (Multi-page: Cover + Blueprint + Inventory)
  // ─────────────────────────────────────────────────────────────
  if (pdfLayout === 'report') {
    const pageFormat = pdfPageSize === 'letter' ? 'letter' : 'a4'
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: pageFormat,
    })

    const pWidth = pdf.internal.pageSize.getWidth()
    const pHeight = pdf.internal.pageSize.getHeight()
    const margin = 40

    // ── PAGE 1: EXECUTIVE COVER PAGE ──
    // Accent Banner
    pdf.setFillColor(37, 99, 235)
    pdf.rect(0, 0, pWidth, 10, 'F')

    // Category Pill
    pdf.setFillColor(238, 242, 255)
    pdf.roundedRect(margin, 46, 210, 22, 6, 6, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(37, 99, 235)
    pdf.text('SYSTEM ARCHITECTURE SPECIFICATION', margin + 10, 60)

    // Main Document Title
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(28)
    pdf.setTextColor(15, 23, 42)
    pdf.text(boardName, margin, 104)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(100, 116, 139)
    pdf.text('Complete Engineering Blueprint & Architecture Topology Report', margin, 126)

    // Divider Line
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(1)
    pdf.line(margin, 146, pWidth - margin, 146)

    // 4 KPI Summary Cards
    const stickyCount = elements.filter((e) => e.type === 'sticky').length
    const boxCount = elements.filter((e) => e.type === 'rectangle').length
    const connCount = elements.filter((e) => e.type === 'line' || e.type === 'pen').length
    const textCount = elements.filter((e) => e.type === 'text').length

    const cards = [
      { label: 'Total Components', val: `${elements.length}`, sub: 'Active layers' },
      { label: 'Sticky Annotations', val: `${stickyCount}`, sub: 'Architecture notes' },
      { label: 'Services & Modules', val: `${boxCount}`, sub: 'Bounding nodes' },
      { label: 'Interconnects', val: `${connCount + textCount}`, sub: 'Pipes & labels' },
    ]

    const cardW = (pWidth - margin * 2 - 30) / 2
    const cardH = 68
    const cardStartY = 168

    cards.forEach((c, idx) => {
      const col = idx % 2
      const row = Math.floor(idx / 2)
      const cx = margin + col * (cardW + 30)
      const cy = cardStartY + row * (cardH + 16)

      pdf.setFillColor(248, 250, 252)
      pdf.setDrawColor(226, 232, 240)
      pdf.roundedRect(cx, cy, cardW, cardH, 8, 8, 'FD')

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 116, 139)
      pdf.text(c.label, cx + 14, cy + 22)

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.setTextColor(15, 23, 42)
      pdf.text(c.val, cx + 14, cy + 46)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text(c.sub, cx + 14, cy + 60)
    })

    // Project Metadata Box
    const metaY = cardStartY + cardH * 2 + 36
    pdf.setFillColor(241, 245, 249)
    pdf.roundedRect(margin, metaY, pWidth - margin * 2, 110, 8, 8, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.setTextColor(30, 41, 59)
    pdf.text('SPECIFICATION METADATA', margin + 18, metaY + 24)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    pdf.setTextColor(71, 85, 105)
    pdf.text(`• Workspace: Northstar Studio (Production Tier)`, margin + 18, metaY + 44)
    pdf.text(`• Author / Lead: Alex Morgan (Workspace Admin)`, margin + 18, metaY + 62)
    pdf.text(`• Generation Date: ${dateStr}`, margin + 18, metaY + 80)
    pdf.text(`• Verification: Multi-page Vector PDF Engine`, margin + 18, metaY + 98)

    // Sticky Notes Executive Summary Section
    const stickyElements = elements.filter((e) => e.type === 'sticky') as Array<{ text?: string }>
    if (stickyElements.length > 0) {
      const noteY = metaY + 130
      pdf.setFillColor(254, 243, 199)
      pdf.setDrawColor(245, 158, 11)
      pdf.roundedRect(margin, noteY, pWidth - margin * 2, 140, 8, 8, 'FD')

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(180, 83, 9)
      pdf.text('💡 ARCHITECTURE DECISIONS & ANNOTATIONS', margin + 18, noteY + 24)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(69, 26, 3)

      let lineCursor = noteY + 42
      stickyElements.slice(0, 4).forEach((sn, i) => {
        const textSample = (sn.text || '').replace(/\n/g, ' • ').substring(0, 90)
        pdf.text(`[Note ${i + 1}] ${textSample}`, margin + 18, lineCursor)
        lineCursor += 18
      })
    }

    // Cover Page Footer
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Buildly 2.0 • Executive Architecture Specification', margin, pHeight - 24)
    pdf.text('Page 1 of 3', pWidth - margin - 50, pHeight - 24)

    // ── PAGE 2: FULL BLUEPRINT ──
    pdf.addPage(pageFormat, isLandscape ? 'landscape' : 'portrait')
    const p2W = pdf.internal.pageSize.getWidth()
    const p2H = pdf.internal.pageSize.getHeight()

    // Page 2 Header
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(15)
    pdf.setTextColor(15, 23, 42)
    pdf.text(`${boardName} — Architecture Blueprint`, margin, 34)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(100, 116, 139)
    pdf.text(`Section 1: Complete High-Resolution Visual Layout (${bounds.width}px × ${bounds.height}px)`, margin, 48)

    // Fit diagram inside Page 2
    const p2Top = 60
    const p2Bottom = 36
    const p2AvailW = p2W - margin * 2
    const p2AvailH = p2H - p2Top - p2Bottom

    const p2Aspect = bounds.width / bounds.height
    const p2AvailAspect = p2AvailW / p2AvailH

    let p2RenderW = p2AvailW
    let p2RenderH = p2AvailW / p2Aspect
    if (p2Aspect < p2AvailAspect) {
      p2RenderH = p2AvailH
      p2RenderW = p2AvailH * p2Aspect
    }

    const p2X = margin + (p2AvailW - p2RenderW) / 2
    const p2Y = p2Top + (p2AvailH - p2RenderH) / 2

    // Border around blueprint
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(1)
    pdf.rect(p2X - 4, p2Y - 4, p2RenderW + 8, p2RenderH + 8)

    pdf.addImage(imgData, 'PNG', p2X, p2Y, p2RenderW, p2RenderH, undefined, 'FAST')

    // Page 2 Footer
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Buildly 2.0 • Architecture Blueprint', margin, p2H - 16)
    pdf.text('Page 2 of 3', p2W - margin - 50, p2H - 16)

    // ── PAGE 3: COMPONENT INVENTORY & ATTRIBUTES ──
    pdf.addPage(pageFormat, 'portrait')
    const p3W = pdf.internal.pageSize.getWidth()
    const p3H = pdf.internal.pageSize.getHeight()

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(15)
    pdf.setTextColor(15, 23, 42)
    pdf.text('Component & Layer Inventory', margin, 34)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(100, 116, 139)
    pdf.text(`Section 2: Detailed catalog of all ${elements.length} whiteboard entities`, margin, 48)

    // Table Header
    const tableY = 66
    pdf.setFillColor(241, 245, 249)
    pdf.rect(margin, tableY, p3W - margin * 2, 22, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8.5)
    pdf.setTextColor(51, 65, 85)
    pdf.text('#', margin + 8, tableY + 15)
    pdf.text('Component Type', margin + 30, tableY + 15)
    pdf.text('Description / Content', margin + 140, tableY + 15)
    pdf.text('Color / Theme', margin + 360, tableY + 15)
    pdf.text('Dimensions / Coord', p3W - margin - 110, tableY + 15)

    let rowY = tableY + 22
    const maxRows = Math.min(elements.length, 28)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)

    for (let i = 0; i < maxRows; i++) {
      const el = elements[i]
      const isEven = i % 2 === 0
      if (isEven) {
        pdf.setFillColor(248, 250, 252)
        pdf.rect(margin, rowY, p3W - margin * 2, 18, 'F')
      }

      pdf.setTextColor(71, 85, 105)
      pdf.text(`${i + 1}`, margin + 8, rowY + 12)

      const typeLabel = el.type.toUpperCase()
      pdf.text(typeLabel, margin + 30, rowY + 12)

      let desc = ''
      if (el.type === 'sticky') desc = (el.text || '').replace(/\n/g, ' ').substring(0, 45)
      else if (el.type === 'text') desc = (el.text || '').substring(0, 45)
      else if (el.type === 'rectangle') desc = `Box [${Math.round(el.width)}×${Math.round(el.height)}]`
      else if (el.type === 'circle') desc = `Circle [r=${Math.round(el.radius)}]`
      else if (el.type === 'line') desc = `Vector connector`
      else if (el.type === 'pen') desc = `Freehand stroke (${el.points?.length || 0} pts)`
      pdf.text(desc, margin + 140, rowY + 12)

      const colStr = el.color || '#000000'
      pdf.text(colStr, margin + 360, rowY + 12)

      const b = getElementBounds(el)
      const coordStr = b ? `${Math.round(b.x)},${Math.round(b.y)}` : '-'
      pdf.text(coordStr, p3W - margin - 110, rowY + 12)

      rowY += 18
    }

    if (elements.length > maxRows) {
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(148, 163, 184)
      pdf.text(`+ ${elements.length - maxRows} additional diagram elements omitted for brevity`, margin + 8, rowY + 16)
    }

    // Page 3 Footer
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.text('Buildly 2.0 • End of Specification Document', margin, p3H - 16)
    pdf.text('Page 3 of 3', p3W - margin - 50, p3H - 16)

    pdf.save(`buildly_report_${sanitized}.pdf`)
    return
  }

  // ─────────────────────────────────────────────────────────────
  // 3. PRINTABLE 2x2 POSTER GRID (4-Page Tiled Layout)
  // ─────────────────────────────────────────────────────────────
  if (pdfLayout === 'grid') {
    const pageFormat = pdfPageSize === 'letter' ? 'letter' : 'a4'
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: pageFormat,
    })

    const pWidth = pdf.internal.pageSize.getWidth()
    const pHeight = pdf.internal.pageSize.getHeight()
    const margin = 36

    const quadrants = [
      { name: 'Quadrant 1: North-West (Top-Left)', xPct: 0, yPct: 0 },
      { name: 'Quadrant 2: North-East (Top-Right)', xPct: 0.5, yPct: 0 },
      { name: 'Quadrant 3: South-West (Bottom-Left)', xPct: 0, yPct: 0.5 },
      { name: 'Quadrant 4: South-East (Bottom-Right)', xPct: 0.5, yPct: 0.5 },
    ]

    const availW = pWidth - margin * 2
    const availH = pHeight - margin * 2 - 30

    quadrants.forEach((q, idx) => {
      if (idx > 0) pdf.addPage(pageFormat, 'landscape')

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.setTextColor(15, 23, 42)
      pdf.text(`${boardName} • ${q.name}`, margin, 26)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(100, 116, 139)
      pdf.text('2x2 Tiled High-Resolution Poster Print • Assemble with adjacent sheets', margin, 38)

      // Crop & zoom on quadrant
      const subScale = 2
      const fullW = bounds.width * subScale
      const fullH = bounds.height * subScale
      const qW = fullW / 2
      const qH = fullH / 2

      // Create quadrant canvas
      const qCanvas = document.createElement('canvas')
      qCanvas.width = Math.ceil(qW)
      qCanvas.height = Math.ceil(qH)
      const qCtx = qCanvas.getContext('2d')
      if (qCtx) {
        qCtx.drawImage(
          canvas,
          q.xPct * canvas.width,
          q.yPct * canvas.height,
          canvas.width / 2,
          canvas.height / 2,
          0,
          0,
          qCanvas.width,
          qCanvas.height,
        )
        const qImg = qCanvas.toDataURL('image/png')

        let rW = availW
        let rH = (availW / qW) * qH
        if (rH > availH) {
          rH = availH
          rW = (availH / qH) * qW
        }

        const qX = margin + (availW - rW) / 2
        const qY = 48 + (availH - rH) / 2

        pdf.setDrawColor(226, 232, 240)
        pdf.rect(qX - 2, qY - 2, rW + 4, rH + 4)
        pdf.addImage(qImg, 'PNG', qX, qY, rW, rH, undefined, 'FAST')
      }

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text(`Sheet ${idx + 1} of 4 • Buildly Poster Print`, margin, pHeight - 12)
    })

    pdf.save(`buildly_poster_grid_${sanitized}.pdf`)
    return
  }

  // ─────────────────────────────────────────────────────────────
  // 4. SMART FIT SINGLE PAGE (Default)
  // ─────────────────────────────────────────────────────────────
  const pageFormat = pdfPageSize === 'letter' ? 'letter' : 'a4'
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: pageFormat,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 36

  // Header Banner
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(15, 23, 42)
  pdf.text(`Buildly — ${boardName}`, margin, 32)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(100, 116, 139)
  pdf.text(`Exported on ${dateStr} • ${elements.length} elements`, margin, 46)

  const topOffset = 58
  const availW = pageWidth - margin * 2
  const availH = pageHeight - topOffset - margin

  const imgAspect = bounds.width / bounds.height
  const availAspect = availW / availH

  let renderW: number
  let renderH: number

  if (imgAspect > availAspect) {
    renderW = availW
    renderH = availW / imgAspect
  } else {
    renderH = availH
    renderW = availH * imgAspect
  }

  const posX = margin + (availW - renderW) / 2
  const posY = topOffset + (availH - renderH) / 2

  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(1)
  pdf.rect(posX - 4, posY - 4, renderW + 8, renderH + 8)

  pdf.addImage(imgData, 'PNG', posX, posY, renderW, renderH, undefined, 'FAST')

  pdf.setFontSize(8)
  pdf.setTextColor(148, 163, 184)
  pdf.text('Created with Buildly — Think together. Build together.', margin, pageHeight - 16)

  pdf.save(`buildly_${sanitized}.pdf`)
}

/**
 * Exports to a standalone PNG image.
 */
export function exportToPng(options: ExportOptions): void {
  const { boardName } = options
  const offscreen = renderOffscreen(options)
  if (!offscreen) return

  const dataUrl = offscreen.canvas.toDataURL('image/png', 1.0)
  const sanitized = boardName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()

  const link = document.createElement('a')
  link.download = `buildly_${sanitized}.png`
  link.href = dataUrl
  link.click()
}

/**
 * Exports to a clean SVG vector file.
 */
export function exportToSvg(options: ExportOptions): void {
  const { boardName, elements, theme = 'light' } = options
  const bounds = getContentBounds(elements)
  const bgColor = theme === 'dark' ? '#0f1117' : '#ffffff'

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" width="${bounds.width}" height="${bounds.height}">\n`
  svgContent += `  <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="${bgColor}" />\n`

  for (const el of elements) {
    switch (el.type) {
      case 'pen': {
        if (el.points.length === 0) break
        const d = el.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ')
        svgContent += `  <path d="${d}" fill="none" stroke="${el.color}" stroke-width="${el.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />\n`
        break
      }
      case 'line': {
        svgContent += `  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.color}" stroke-width="${el.strokeWidth}" stroke-linecap="round" />\n`
        break
      }
      case 'rectangle': {
        const fill = el.fill ? el.fill : 'none'
        svgContent += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${el.color}" stroke-width="${el.strokeWidth}" rx="4" />\n`
        break
      }
      case 'circle': {
        const fill = el.fill ? el.fill : 'none'
        svgContent += `  <circle cx="${el.cx}" cy="${el.cy}" r="${Math.abs(el.radius)}" fill="${fill}" stroke="${el.color}" stroke-width="${el.strokeWidth}" />\n`
        break
      }
      case 'sticky': {
        const noteBg = el.noteColor || '#fef08a'
        svgContent += `  <g>\n`
        svgContent += `    <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${noteBg}" stroke="${el.color || '#ca8a04'}" stroke-width="1.5" rx="8" />\n`
        svgContent += `    <rect x="${el.x}" y="${el.y}" width="${el.width}" height="8" fill="${el.color || '#eab308'}" rx="4" />\n`
        const lines = el.text ? el.text.split('\n') : ['']
        lines.forEach((line, idx) => {
          svgContent += `    <text x="${el.x + 12}" y="${el.y + 26 + idx * 18}" font-family="Inter, sans-serif" font-size="13" font-weight="500" fill="#0f172a">${line}</text>\n`
        })
        svgContent += `  </g>\n`
        break
      }
      case 'text': {
        const fSize = el.fontSize || 16
        const lines = el.text ? el.text.split('\n') : ['']
        lines.forEach((line, idx) => {
          svgContent += `  <text x="${el.x}" y="${el.y + 16 + idx * (fSize * 1.3)}" font-family="Inter, sans-serif" font-size="${fSize}" font-weight="600" fill="${el.color || '#0f172a'}">${line}</text>\n`
        })
        break
      }
    }
  }

  svgContent += `</svg>`

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const sanitized = boardName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()

  const link = document.createElement('a')
  link.download = `buildly_${sanitized}.svg`
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Copies high-res canvas diagram directly to the user's system clipboard as PNG.
 */
export async function copyToClipboardPng(options: ExportOptions): Promise<boolean> {
  const offscreen = renderOffscreen(options)
  if (!offscreen) return false

  return new Promise((resolve) => {
    offscreen.canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        resolve(true)
      } catch (err) {
        console.error('Failed to copy diagram image to clipboard:', err)
        resolve(false)
      }
    }, 'image/png')
  })
}

/**
 * Exports the raw board data as JSON for backup and reload.
 */
export function exportToJson(options: ExportOptions): void {
  const { boardName, elements } = options
  const data = {
    version: '1.0.0',
    app: 'Buildly',
    exportedAt: new Date().toISOString(),
    board: {
      name: boardName,
      elements,
    },
  }

  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const sanitized = boardName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()

  const link = document.createElement('a')
  link.download = `buildly_${sanitized}.buildly.json`
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}
