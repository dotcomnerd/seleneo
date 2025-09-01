"use client";

import { useDrawingTools } from '@/store/use-drawing';
import { useImageOptions } from '@/store/use-image-options';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Moveable from 'react-moveable';
import DrawingContextMenu from './drawing-context-menu';

export default function DrawingMoveable() {
    const { drawings = [], setDrawings } = useImageOptions()
    const { currentTool, selectedStrokeId, setSelectedStrokeId, setDragOffset } = useDrawingTools()

    const boxes = React.useMemo(() => (
        drawings.map((d) => {
            const xs = d.points.map((p) => p.x)
            const ys = d.points.map((p) => p.y)
            const minX = Math.min(...xs)
            const maxX = Math.max(...xs)
            const minY = Math.min(...ys)
            const maxY = Math.max(...ys)
            const pad = Math.max(4, d.strokeWidth)
            return {
                id: d.id,
                left: minX - pad,
                top: minY - pad,
                width: (maxX - minX) + pad * 2,
                height: (maxY - minY) + pad * 2,
            }
        })
    ), [drawings])

    // delete hotkey (here i'm always registering to keep our hooks order consistent, )
    useHotkeys('Delete', () => {
        if (!selectedStrokeId) return
        const filtered = drawings.filter((d) => d.id !== selectedStrokeId)
        setDrawings?.(filtered)
        setSelectedStrokeId(null)
    }, [selectedStrokeId, drawings])

    const targetEl = selectedStrokeId ? document.getElementById(`stroke-box-${selectedStrokeId}`) as HTMLElement | null : null

    if (currentTool !== 'select') return null

    return (
        <div className="absolute inset-0 z-20 pointer-events-none">
            {boxes.map((b) => (
                <DrawingContextMenu key={b.id} id={b.id}>
                    <div
                        id={`stroke-box-${b.id}`}
                        className="absolute border border-transparent hover:border-primary/50 stroke-box"
                        style={{ left: b.left, top: b.top, width: b.width, height: b.height, pointerEvents: 'auto' }}
                        onMouseDown={(e) => {
                            e.stopPropagation()
                            setSelectedStrokeId(b.id)
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedStrokeId(b.id)
                        }}
                    />
                </DrawingContextMenu>
            ))}

            {targetEl && (
                <Moveable
                    target={targetEl}
                    draggable
                    hideDefaultLines
                    throttleDrag={0}
                    origin={false}
                    onDragStart={() => {
                        setDragOffset({ dx: 0, dy: 0 })
                    }}
                    onDrag={(e) => {
                        const { beforeTranslate } = e
                        setDragOffset({ dx: beforeTranslate[0], dy: beforeTranslate[1] })
                    }}
                    onDragEnd={(e) => {
                        const { lastEvent } = e
                        if (!lastEvent || !selectedStrokeId) { setDragOffset(null); return }
                        const dx = lastEvent.beforeTranslate[0]
                        const dy = lastEvent.beforeTranslate[1]
                        const updated = drawings.map((d) => {
                            if (d.id !== selectedStrokeId) return d
                            return {
                                ...d,
                                points: d.points.map((p) => ({ x: p.x + dx, y: p.y + dy, pressure: p.pressure })),
                            }
                        })
                        setDragOffset(null)
                        setDrawings?.(updated)
                    }}
                />
            )}
        </div>
    )
}
