import { useState } from 'react'
import type { CanvasElement } from '../../types/canvas'
import {
  exportToPdf,
  exportToPng,
  exportToSvg,
  exportToJson,
  type ExportFormat,
} from '../../utils/exportBoard'
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
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const opts = { boardName, elements, theme }
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
            <span className="export-modal__icon">📥</span>
            <h3 id="export-modal-title" className="export-modal__title">
              Export Workspace
            </h3>
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
          <p className="export-modal__desc">
            Download your diagram and whiteboard in your desired format:
          </p>

          {/* Option: PDF */}
          <div
            className={`export-format-option ${
              selectedFormat === 'pdf' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('pdf')}
          >
            <div className="export-format-left">
              <div className="export-format-icon">📄</div>
              <div>
                <div className="export-format-name">
                  <span>PDF Document</span>
                  <span className="export-badge-recommended">Recommended</span>
                </div>
                <div className="export-format-ext">
                  Print-ready vector document (.pdf)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'pdf' && <div className="export-radio-dot" />}
            </div>
          </div>

          {/* Option: PNG */}
          <div
            className={`export-format-option ${
              selectedFormat === 'png' ? 'export-format-option--selected' : ''
            }`}
            onClick={() => setSelectedFormat('png')}
          >
            <div className="export-format-left">
              <div className="export-format-icon">🖼️</div>
              <div>
                <div className="export-format-name">High-Res PNG Image</div>
                <div className="export-format-ext">
                  Raster graphic for sharing &amp; decks (.png)
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
              <div className="export-format-icon">📐</div>
              <div>
                <div className="export-format-name">Scalable Vector Graphic</div>
                <div className="export-format-ext">
                  Infinitely scalable code format (.svg)
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
              <div className="export-format-icon">🗄️</div>
              <div>
                <div className="export-format-name">Buildly Workspace JSON</div>
                <div className="export-format-ext">
                  Complete board data to reload later (.json)
                </div>
              </div>
            </div>
            <div className="export-radio-circle">
              {selectedFormat === 'json' && <div className="export-radio-dot" />}
            </div>
          </div>
        </div>

        <div className="export-modal__footer">
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
