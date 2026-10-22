import { useCallback, useEffect } from 'react'
import type { Tool } from '../types/canvas'

// ============================================================
// useKeyboardShortcuts
// Global keyboard shortcuts for the Board workspace.
//
// Shortcuts:
//   P → Pen        L → Line
//   R → Rectangle  C → Circle
//   S → Select     E → Eraser
//   Ctrl+Z → Undo  Ctrl+Shift+Z → Redo
// ============================================================

interface Options {
  onToolChange: (t: Tool) => void
  onUndo: () => void
  onRedo: () => void
}

const TOOL_KEYS: Record<string, Tool> = {
  p: 'pen',
  l: 'line',
  r: 'rectangle',
  c: 'circle',
  s: 'select',
  e: 'eraser',
}

export function useKeyboardShortcuts({ onToolChange, onUndo, onRedo }: Options) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in an input
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      const key = e.key.toLowerCase()

      if (e.ctrlKey || e.metaKey) {
        if (key === 'z' && e.shiftKey) { e.preventDefault(); onRedo() }
        else if (key === 'z') { e.preventDefault(); onUndo() }
        return
      }

      const tool = TOOL_KEYS[key]
      if (tool) onToolChange(tool)
    },
    [onToolChange, onUndo, onRedo],
  )

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}
