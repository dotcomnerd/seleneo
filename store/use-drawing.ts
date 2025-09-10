'use client'

import { z } from 'zod'
import { create } from 'zustand'

export const DrawingToolSchema = z.enum(['select', 'pen', 'eraser'])
export type DrawingTool = z.infer<typeof DrawingToolSchema>

export const DrawingPointSchema = z.object({
    x: z.number(),
    y: z.number(),
    pressure: z.number().optional(),
})
export type DrawingPoint = z.infer<typeof DrawingPointSchema>

export const DrawingPathSchema = z.object({
    id: z.string(),
    type: z.enum(['pen', 'eraser']),
    points: z.array(DrawingPointSchema),
    color: z.string(),
    strokeWidth: z.number(),
    opacity: z.number(),
    createdAt: z.number(),
})
export type DrawingPath = z.infer<typeof DrawingPathSchema>

export const DragOffsetSchema = z.object({
    dx: z.number(),
    dy: z.number(),
})
export type DragOffset = z.infer<typeof DragOffsetSchema>

interface DrawingToolsState {
    currentTool: DrawingTool
    currentColor: string
    currentStrokeWidth: number
    currentOpacity: number
    isDrawing: boolean
    selectedStrokeId: string | null
    dragOffset: DragOffset | null

    setCurrentTool: (tool: DrawingTool) => void
    setCurrentColor: (color: string) => void
    setCurrentStrokeWidth: (width: number) => void
    setCurrentOpacity: (opacity: number) => void
    setIsDrawing: (isDrawing: boolean) => void
    setSelectedStrokeId: (id: string | null) => void
    setDragOffset: (offset: DragOffset | null) => void
}

export const useDrawingTools = create<DrawingToolsState>()((set,) => ({
    currentTool: 'select',
    currentColor: '#000000',
    currentStrokeWidth: 3,
    currentOpacity: 1,
    isDrawing: false,
    selectedStrokeId: null,
    dragOffset: null,

    setCurrentTool: (currentTool) => set({ currentTool }),
    setCurrentColor: (currentColor) => set({ currentColor }),
    setCurrentStrokeWidth: (currentStrokeWidth) => set({ currentStrokeWidth }),
    setCurrentOpacity: (currentOpacity) => set({ currentOpacity }),
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    setSelectedStrokeId: (selectedStrokeId) => set({ selectedStrokeId }),
    setDragOffset: (dragOffset) => set({ dragOffset }),
}))
