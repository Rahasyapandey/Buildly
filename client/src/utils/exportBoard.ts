import { jsPDF } from 'jspdf'
import type { CanvasElement } from '../types/canvas'
import { renderElement, getElementBounds } from './renderElement'

export type ExportFormat = 'pdf' | 'png' | 'svg' | 'json'

export interface ExportOptions {
  boardName: string
  elements: CanvasElement[]
  canvasWidth?: number
  canvasHeight?: number
  theme?: 'light' | 'dark'
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
 * Exports the workspace to a high-quality PDF document.
 */
export async function exportToPdf(options: ExportOptions): Promise<void> {
  const { boardName, elements } = options
  const offscreen = renderOffscreen(options)
  if (!offscreen) return

  const { canvas, bounds } = offscreen
  const imgData = canvas.toDataURL('image/png', 1.0)

  // Determine PDF orientation based on aspect ratio
  const isLandscape = bounds.width >= bounds.height
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Header Banner
  const margin = 36
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(15, 23, 42) // Slate-900
  pdf.text(`Buildly — ${boardName}`, margin, 32)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(100, 116, 139) // Slate-500
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  pdf.text(`Exported on ${dateStr} • ${elements.length} elements`, margin, 46)

  // Calculate image fit inside the page below header
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

  // Border frame around diagram
  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(1)
  pdf.rect(posX - 4, posY - 4, renderW + 8, renderH + 8)

  pdf.addImage(imgData, 'PNG', posX, posY, renderW, renderH, undefined, 'FAST')

  // Footer branding
  pdf.setFontSize(8)
  pdf.setTextColor(148, 163, 184)
  pdf.text(
    'Created with Buildly — Think together. Build together.',
    margin,
    pageHeight - 16,
  )

  const sanitized = boardName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
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
