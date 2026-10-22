import { useCallback, useReducer } from 'react'
import type { CanvasElement, BoardState, NewCanvasElement } from '../types/canvas'
import { nanoid } from '../utils/nanoid'

// ============================================================
// useBoardState
// Manages the elements array with proper undo/redo history.
//
// Design: every mutation creates a new snapshot of the elements
// array and pushes it onto the history stack. Undo/redo simply
// moves the historyIndex pointer.
// ============================================================

// ── Actions ──────────────────────────────────────────────────

type Action =
  | { type: 'ADD_ELEMENT'; element: CanvasElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<CanvasElement> }
  | { type: 'REMOVE_ELEMENT'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_ELEMENTS'; elements: CanvasElement[] } // Phase 3: from API
  | { type: 'SET_SELECTED'; id: string | null }

// ── Reducer ──────────────────────────────────────────────────

const initialState: BoardState = {
  elements: [],
  history: [[]],
  historyIndex: 0,
  selectedId: null,
}

function boardReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const next = [...state.elements, action.element]
      const history = [
        ...state.history.slice(0, state.historyIndex + 1),
        next,
      ]
      return {
        ...state,
        elements: next,
        history,
        historyIndex: history.length - 1,
        selectedId: null,
      }
    }

    case 'UPDATE_ELEMENT': {
      const next = state.elements.map((el) =>
        el.id === action.id ? ({ ...el, ...action.updates } as CanvasElement) : el,
      )
      const history = [
        ...state.history.slice(0, state.historyIndex + 1),
        next,
      ]
      return {
        ...state,
        elements: next,
        history,
        historyIndex: history.length - 1,
      }
    }

    case 'REMOVE_ELEMENT': {
      const next = state.elements.filter((el) => el.id !== action.id)
      const history = [
        ...state.history.slice(0, state.historyIndex + 1),
        next,
      ]
      return {
        ...state,
        elements: next,
        history,
        historyIndex: history.length - 1,
        selectedId: null,
      }
    }

    case 'CLEAR_ALL': {
      const history = [...state.history.slice(0, state.historyIndex + 1), []]
      return {
        ...state,
        elements: [],
        history,
        historyIndex: history.length - 1,
        selectedId: null,
      }
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const idx = state.historyIndex - 1
      return {
        ...state,
        elements: state.history[idx] ?? [],
        historyIndex: idx,
        selectedId: null,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const idx = state.historyIndex + 1
      return {
        ...state,
        elements: state.history[idx] ?? [],
        historyIndex: idx,
        selectedId: null,
      }
    }

    case 'LOAD_ELEMENTS': {
      return {
        ...initialState,
        elements: action.elements,
        history: [action.elements],
        historyIndex: 0,
      }
    }

    case 'SET_SELECTED': {
      return { ...state, selectedId: action.id }
    }

    default:
      return state
  }
}

// ── Hook ─────────────────────────────────────────────────────

export function useBoardState() {
  const [state, dispatch] = useReducer(boardReducer, initialState)

  const addElement = useCallback(
    (el: NewCanvasElement) => {
      dispatch({
        type: 'ADD_ELEMENT',
        element: { ...el, id: nanoid() } as CanvasElement,
      })
    },
    [],
  )

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', id, updates })
  }, [])

  const removeElement = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', id })
  }, [])

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const loadElements = useCallback((elements: CanvasElement[]) => {
    dispatch({ type: 'LOAD_ELEMENTS', elements })
  }, [])

  const setSelected = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED', id })
  }, [])

  return {
    elements: state.elements,
    selectedId: state.selectedId,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    addElement,
    updateElement,
    removeElement,
    clearAll,
    undo,
    redo,
    loadElements,
    setSelected,
  }
}
