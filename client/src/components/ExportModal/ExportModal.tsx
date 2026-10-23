import { useState, useRef, useEffect } from 'react'
import type { CanvasElement } from '../../types/canvas'
import {
  exportToPdf,
  exportToPng,
  exportToSvg,
  exportToJson,
  copyToClipboardPng,
  type ExportFormat,
  type PdfLayout,
  type PdfPageSize,
  type PdfThemeMode,
} from '../../utils/exportBoard'
import { renderElement } from '../../utils/renderElement'
import {
  IconCheck,
  IconDatabase,
  IconDiagram,
  IconDownload,
  IconFileText,
  IconImage,
  IconScreen,
  IconShare,
} from '../Icons/Icons'
import './ExportModal.css'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  boardName: string
  elements: CanvasElement[]
  theme: 'light' | 'dark'
}

export default function ExportModal({
  isOpen,
  onClose,
  boardName,
  elements,
  theme,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [pdfLayout, setPdfLayout] = useState<PdfLayout>('report')
  const [pdfPageSize, setPdfPageSize] = useState<PdfPageSize>('a4')
  const [pdfThemeMode, setPdfThemeMode] = useState<PdfThemeMode>('light')
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Draw scaled miniature preview on mount/update
  useEffect(() => {
    if (!isOpen) return
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bgFill =
      selectedFormat === 'pdf' && pdfThemeMode === 'dark'
        ? '#161822'
        : selectedFormat === 'pdf' && pdfThemeMode === 'light'
        ? '#f8fafc'
        : theme === 'dark'
        ? '#161822'
        : '#f8fafc'

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = bgFill
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Compute bounds and scale
    if (elements.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const el of elements) {
        if ('points' in el && el.points) {
          el.points.forEach((p) => {
            minX = Math.min(minX, p.x); minY = Math.min(minY, p.y)
            maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y)
          })
        } else if ('x' in el && 'width' in el) {
          minX = Math.min(minX, el.x); minY = Math.min(minY, el.y)
          maxX = Math.max(maxX, el.x + el.width); maxY = Math.max(maxY, el.y + el.height)
        } else if ('cx' in el && 'radius' in el) {
          minX = Math.min(minX, el.cx - el.radius); minY = Math.min(minY, el.cy - el.radius)
          maxX = Math.max(maxX, el.cx + el.radius); maxY = Math.max(maxY, el.cy + el.radius)
        } else if ('x1' in el) {
          minX = Math.min(minX, el.x1, el.x2); minY = Math.min(minY, el.y1, el.y2)
          maxX = Math.max(maxX, el.x1, el.x2); maxY = Math.max(maxY, el.y1, el.y2)
        }
      }

      if (minX !== Infinity) {
        const pad = 20
        const contentW = Math.max(100, maxX - minX + pad * 2)
        const contentH = Math.max(100, maxY - minY + pad * 2)
        const scaleX = canvas.width / contentW
        const scaleY = canvas.height / contentH
        const scale = Math.min(scaleX, scaleY, 0.8)

        ctx.save()
        ctx.translate(
          (canvas.width - contentW * scale) / 2 - (minX - pad) * scale,
          (canvas.height - contentH * scale) / 2 - (minY - pad) * scale,
        )
        ctx.scale(scale, scale)

        for (const el of elements) {
          renderElement(ctx, el, false)
        }
        ctx.restore()
      }
    } else {
      ctx.fillStyle = theme === 'dark' ? '#64748b' : '#94a3b8'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Canvas is empty — drawings will appear here', canvas.width / 2, canvas.height / 2)
    }
  }, [isOpen, elements, theme, selectedFormat, pdfThemeMode])

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const opts = {
        boardName,
        elements,
        theme,
        pdfLayout,
        pdfPageSize,
        pdfThemeMode,
      }
      switch (selectedFormat) {
        case 'pdf':
          await exportToPdf(opts)
          break
        case 'png':
          exportToPng(opts)
          break
        case 'svg':
          exportToSvg(opts)
          break
        case 'json':
          exportToJson(opts)
          break
      }
      onClose()
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. Please check the console for details.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyClipboard = async () => {
    const success = await copyToClipboardPng({ boardName, elements, theme })
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <div className="export-modal-backdrop" onClick={onClose}>
      <div
        className="export-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        <div className="export-modal__header">
          <div className="export-modal__title-row">
            <span className="export-modal__icon"><IconDownload size={18} /></span>
            <div>
              <h3 id="export-modal-title" className="export-modal__title">
                Export Workspace Diagram
              </h3>
              <span className="export-modal__sub">{boardName} • {elements.length} elements</span>
            </div>
          </div>
          <button
            className="export-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="export-modal__body">
          {/* Live Preview Box */}
          <div className="export-preview-card">
            <div className="export-preview-header">
              <span>LIVE DIAGRAM PREVIEW</span>
              <span className="export-preview-tag">
                {selectedFormat === 'pdf'
                  ? `PDF • ${pdfLayout.toUpperCase()} (${pdfPageSize.toUpperCase()})`
                  : '2x High-DPI'}
              </span>
            </div>
            <canvas
              ref={previewCanvasRef}
              width={420}
              height={130}
              className="export-preview-canvas"
            />
          </div>

          <p className="export-modal__desc">
            Choose your preferred export format for documentation or presentations:
          </p>

          {/* Option: PDF */}
          <div
            className={`export-format-option ${
              selectedFormat === 'pdf' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('pdf')}
          >
            <div className="export-format-left">
              <div className="export-format-icon"><IconFileText size={18} /></div>
              <div>
                <div className="export-format-name">
                  <span>PDF Document</span>
                  <span className="export-badge-recommended">Multi-Format Vector</span>
                </div>
                <div className="export-format-ext">
                  Executive reports, slide decks, and printable posters (.pdf)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'pdf' && <div className="export-radio-dot" />}
            </div>
          </div>

          {/* PDF Format Sub-Configuration Panel */}
          {selectedFormat === 'pdf' && (
            <div className="export-pdf-config">
              <div className="export-pdf-config__title">PDF Layout Style</div>
              <div className="export-pdf-layouts">
                <button
                  type="button"
                  className={`export-pdf-pill ${pdfLayout === 'report' ? 'export-pdf-pill--active' : ''}`}
                  onClick={() => setPdfLayout('report')}
                >
                  <span className="export-pdf-pill__icon"><IconFileText size={15} /></span>
                  <div>
                    <div className="export-pdf-pill__name">Executive Report</div>
                    <div className="export-pdf-pill__desc">3-Page Doc with cover &amp; inventory</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`export-pdf-pill ${pdfLayout === 'presentation' ? 'export-pdf-pill--active' : ''}`}
                  onClick={() => setPdfLayout('presentation')}
                >
                  <span className="export-pdf-pill__icon"><IconScreen size={15} /></span>
                  <div>
                    <div className="export-pdf-pill__name">Presentation (16:9)</div>
                    <div className="export-pdf-pill__desc">Widescreen slide deck</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`export-pdf-pill ${pdfLayout === 'fit' ? 'export-pdf-pill--active' : ''}`}
                  onClick={() => setPdfLayout('fit')}
                >
                  <span className="export-pdf-pill__icon"><IconFileText size={15} /></span>
                  <div>
                    <div className="export-pdf-pill__name">Single Page</div>
                    <div className="export-pdf-pill__desc">Smart auto-fit diagram</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`export-pdf-pill ${pdfLayout === 'grid' ? 'export-pdf-pill--active' : ''}`}
                  onClick={() => setPdfLayout('grid')}
                >
                  <span className="export-pdf-pill__icon"><IconDiagram size={15} /></span>
                  <div>
                    <div className="export-pdf-pill__name">Poster Grid (2×2)</div>
                    <div className="export-pdf-pill__desc">4-Page tiled print sheets</div>
                  </div>
                </button>
              </div>

              <div className="export-pdf-controls-row">
                <div className="export-pdf-control-group">
                  <span className="export-pdf-control-label">Page Size:</span>
                  <div className="export-pdf-mini-toggle">
                    <button
                      type="button"
                      className={`export-pdf-mini-btn ${pdfPageSize === 'a4' ? 'export-pdf-mini-btn--active' : ''}`}
                      onClick={() => setPdfPageSize('a4')}
                    >
                      A4 Standard
                    </button>
                    <button
                      type="button"
                      className={`export-pdf-mini-btn ${pdfPageSize === 'letter' ? 'export-pdf-mini-btn--active' : ''}`}
                      onClick={() => setPdfPageSize('letter')}
                    >
                      US Letter
                    </button>
                  </div>
                </div>

                <div className="export-pdf-control-group">
                  <span className="export-pdf-control-label">Theme:</span>
                  <div className="export-pdf-mini-toggle">
                    <button
                      type="button"
                      className={`export-pdf-mini-btn ${pdfThemeMode === 'light' ? 'export-pdf-mini-btn--active' : ''}`}
                      onClick={() => setPdfThemeMode('light')}
                    >
                      Clean Print
                    </button>
                    <button
                      type="button"
                      className={`export-pdf-mini-btn ${pdfThemeMode === 'dark' ? 'export-pdf-mini-btn--active' : ''}`}
                      onClick={() => setPdfThemeMode('dark')}
                    >
                      Dark Canvas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Option: PNG */}
          <div
            className={`export-format-option ${
              selectedFormat === 'png' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('png')}
          >
            <div className="export-format-left">
              <div className="export-format-icon"><IconImage size={18} /></div>
              <div>
                <div className="export-format-name">High-Res PNG Image</div>
                <div className="export-format-ext">
                  Crisp raster graphic for Slack, Notion &amp; decks (.png)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'png' && <div className="export-radio-dot" />}
            </div>
          </div>

          {/* Option: SVG */}
          <div
            className={`export-format-option ${
              selectedFormat === 'svg' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('svg')}
          >
            <div className="export-format-left">
              <div className="export-format-icon"><IconDiagram size={18} /></div>
              <div>
                <div className="export-format-name">Scalable Vector Graphic</div>
                <div className="export-format-ext">
                  Infinitely scalable code format for web &amp; Figma (.svg)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'svg' && <div className="export-radio-dot" />}
            </div>
          </div>

          {/* Option: JSON */}
          <div
            className={`export-format-option ${
              selectedFormat === 'json' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('json')}
          >
            <div className="export-format-left">
              <div className="export-format-icon"><IconDatabase size={18} /></div>
              <div>
                <div className="export-format-name">Buildly Workspace JSON</div>
                <div className="export-format-ext">
                  Raw canvas schema with all layers &amp; properties (.json)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'json' && <div className="export-radio-dot" />}
            </div>
          </div>
        </div>

        <div className="export-modal__footer">
          <button
            className="btn-export-copy"
            onClick={handleCopyClipboard}
            title="Copy high-res image directly to clipboard"
          >
            {copied ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IconCheck size={14} /> Image Copied!
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IconShare size={14} /> Copy Image
              </span>
            )}
          </button>
          <button className="btn-export-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-export-confirm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : `Download .${selectedFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
