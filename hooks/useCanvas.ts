import { useState, useRef, useEffect } from 'react'
import { createContext, useContext, ReactNode } from 'react'

interface CanvasState {
  width: number
  height: number
  gridSize: number
  snapToGrid: boolean
}

export function useCanvas() {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 1920,
    height: 1080,
    gridSize: 20,
    snapToGrid: true,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d')
      drawCanvas()
    }
  }, [canvasState])

  const drawCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return

    const ctx = ctxRef.current
    const canvas = canvasRef.current

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1

    for (let x = 0; x <= canvas.width; x += canvasState.gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y <= canvas.height; y += canvasState.gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
  }

  const updateCanvasSize = (width: number, height: number) => {
    setCanvasState(prev => ({ ...prev, width, height }))
  }

  const updateGridSize = (size: number) => {
    setCanvasState(prev => ({ ...prev, gridSize: size }))
  }

  const toggleSnapToGrid = () => {
    setCanvasState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }))
  }

  return {
    canvasState,
    canvasRef,
    updateCanvasSize,
    updateGridSize,
    toggleSnapToGrid,
  }
}

