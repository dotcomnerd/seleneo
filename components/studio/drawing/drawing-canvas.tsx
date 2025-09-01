'use client'

import { useDrawingTools } from '@/store/use-drawing'
import { useImageOptions } from '@/store/use-image-options'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import getStroke from 'perfect-freehand'
import React from 'react'

export default function DrawingCanvas() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const { resolution, scrollScale } = useResizeCanvas()
    const { drawings = [], setDrawings } = useImageOptions()
    const {
        currentTool,
        currentColor,
        currentStrokeWidth,
        currentOpacity,
        isDrawing,
        setIsDrawing,
        dragOffset,
        selectedStrokeId,
    } = useDrawingTools()

    const [width, height]: number[] = React.useMemo(
        () => resolution.split('x').map(Number),
        [resolution]
    )

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawings.forEach((path) => {
            if (path.points.length < 2) return
            ctx.save()
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = path.color
            ctx.lineWidth = path.strokeWidth
            ctx.globalAlpha = path.opacity
            if (path.type === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out'
                ctx.strokeStyle = 'rgba(0,0,0,1)'
            } else {
                ctx.globalCompositeOperation = 'source-over'
            }
            
            const dx = dragOffset && selectedStrokeId === path.id ? dragOffset.dx : 0
            const dy = dragOffset && selectedStrokeId === path.id ? dragOffset.dy : 0
            const points = path.points.map((p) => [p.x + dx, p.y + dy, p.pressure ?? 0.5])
            const stroke = getStroke(points, {
                size: path.strokeWidth,
                thinning: 0.6,
                smoothing: 0.6,
                streamline: 0.4,
            })

            if (stroke.length > 1) {
                ctx.beginPath()
                ctx.moveTo(stroke[0][0], stroke[0][1])
                for (let i = 1; i < stroke.length; i += 1) {
                    ctx.lineTo(stroke[i][0], stroke[i][1])
                }
                ctx.stroke()
            }
            ctx.restore()
        })
    }, [drawings, width, height, dragOffset, selectedStrokeId])

    const getRelativePoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / scrollScale
        const y = (e.clientY - rect.top) / scrollScale
        return { x, y, pressure: e.pressure || 0.5 }
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (currentTool === 'select') return
        e.stopPropagation()
        const point = getRelativePoint(e)
        setIsDrawing(true)

        const newPath = {
            id: `path-${Date.now()}`,
            type: currentTool === 'eraser' ? 'eraser' as const : currentTool,
            points: [point],
            color: currentColor,
            strokeWidth: currentStrokeWidth,
            opacity: currentOpacity,
            createdAt: Date.now(),
        }
        setDrawings?.([...(drawings || []), newPath])
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || currentTool === 'select') return
        e.stopPropagation()
        const point = getRelativePoint(e)
        if (!drawings || drawings.length === 0) return

        const updated = [...drawings]
        const last = updated[updated.length - 1]
        // adjust width with pressure for smoothing variety
        if (point.pressure && last.type !== 'eraser') {
            last.strokeWidth = Math.max(1, currentStrokeWidth * (0.5 + point.pressure))
        }
        last.points = [...last.points, point]
        setDrawings?.(updated)
    }

    const handlePointerUp = () => {
        if (isDrawing) setIsDrawing(false)
    }

    const cursor = React.useMemo(() => {
        if (currentTool === 'select') return 'default'
        if (currentTool === 'eraser') return 'cell'
        return 'crosshair'
    }, [currentTool])

    // allow clicking underlying UI in select mode; capture input only while drawing
    const pointerEvents = currentTool === 'select' ? 'none' : 'auto'

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none', cursor, pointerEvents }}
        />
    )
}
