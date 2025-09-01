"use client";

import { useDrawingTools } from '@/store/use-drawing';
import { useSelectedLayers } from '@/store/use-image-options';
import { useMoveable } from '@/store/use-moveable';
import dynamic from 'next/dynamic';

const Selecto = dynamic(
  () => import('react-selecto').then((mod) => mod.default),
  {
    ssr: false,
  }
)

export default function SelectoComponent() {
  const {
    setShowControls,
    showControls,
    setIsSelecting,
    setIsMultipleTargetSelected,
  } = useMoveable()
  const { setSelectedImage } = useSelectedLayers()
  const { currentTool, isDrawing } = useDrawingTools()
  if (showControls || isDrawing || currentTool !== 'select') return null
  return (
    <Selecto
      dragContainer={'.canvas-container'}
      selectableTargets={['.image']}
      selectByClick
      selectFromInside={false}
      toggleContinueSelect={['shift']}
      ratio={0}
      hitRate={0}
      onDragStart={(e) => {
        const native = (e as unknown as { inputEvent?: Event }).inputEvent as Event | undefined
        const el = (native?.target ?? null) as Element | null
        if (el && el.closest && el.closest('.stroke-box')) {
          e.stop()
        }
      }}
      onSelectStart={() => {
        setIsSelecting(true)
      }}
      onSelectEnd={(e) => {
        setTimeout(() => {
          setIsSelecting(false)
        }, 100)
        e.added.forEach((el) => {
          el.classList.add('selected')
        })

        e.removed.forEach((el) => {
          el.classList.remove('selected')
        })

        if (e?.selected.length !== 0) {
          setShowControls(true)
          setSelectedImage(e?.selected?.[0]?.id ? +e.selected[0].id : 0)
        }

        if (e?.selected.length > 1) {
          setIsMultipleTargetSelected(true)
        }
      }}
    ></Selecto>
  )
}
