'use client'

import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useImageQualityStore } from '@/store/use-image-quality'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { useEffect, useRef } from 'react'
import {
  Draggable,
  DraggableProps,
  Rotatable,
  RotatableProps,
  Scalable,
  ScalableProps,
  Snappable,
  SnappableProps,
  makeMoveable,
} from 'react-moveable'

const Moveable = makeMoveable<
  DraggableProps & ScalableProps & RotatableProps & SnappableProps
// @ts-expect-error - more hacks yay
>([Draggable, Scalable, Rotatable, Snappable])

export default function TiptapMoveable({ id }: { id: string }) {
  const { quality } = useImageQualityStore()
  const { domResolution, scaleFactor } = useResizeCanvas()
  const { images, texts, setTexts } = useImageOptions()
  const { selectedText } = useSelectedLayers()
  const moveableRef = useRef<any>(null)
  //   const { width, height } = splitWidthHeight(exactDomResolution)

  const [domWidth, domHeight]: number[] = domResolution.split('x').map(Number)

  const otherTexts = texts.filter((text) => text.id !== selectedText)
  const elementGuidelines = [
    ...images.map((image) => ({
      element:
        typeof document !== 'undefined'
          ? document?.getElementById(`${image.id}`)
          : '',
    })),
    ...otherTexts.map((text) => ({
      element:
        typeof document !== 'undefined'
          ? document?.getElementById(`text-${text.id}`)
          : '',
    })),
  ]

  // refresh moveable when text state changes
  useEffect(() => {
    if (moveableRef.current) {
      // i put this delay to let the font load and DOM update
      setTimeout(() => {
        moveableRef.current?.updateRect()
      }, 100)
    }
  }, [texts])

  // make sure saved position is applied when text is restored from JSON
  useEffect(() => {
    if (selectedText && typeof document !== 'undefined') {
      const textElement = texts.find(text => text.id === selectedText)
      const domElement = document.getElementById(`text-${selectedText}`)
      if (textElement && domElement && (textElement.style.translateX !== 0 || textElement.style.translateY !== 0)) {
        // apply saved position to the DOM element
        const transform = `translate(${textElement.style.translateX ?? 0}%, ${textElement.style.translateY ?? 0}%)`
        domElement.style.transform = transform

        // refresh moveable to recognize new position
        if (moveableRef.current) {
          setTimeout(() => moveableRef.current?.updateRect(), 50)
        }
      }
    }
  }, [selectedText, texts, moveableRef])

  return (
    <Moveable
      ref={moveableRef}
      target={
        typeof document !== 'undefined' ? document?.getElementById(id) : ''
      }
      draggable={true}
      onDrag={(e) => {
        e.target.style.transform = e.transform
      }}
      onDragEnd={({ target, lastEvent }) => {
        // @ts-expect-error
        const xPerc = (lastEvent?.translate[0] / target?.offsetWidth) * 100
        // @ts-expect-error
        const yPerc = (lastEvent?.translate[1] / target?.offsetHeight) * 100
        if (selectedText) {
          setTexts(
            texts.map((text) =>
              text.id === selectedText
                ? {
                  ...text,
                  style: {
                    ...text.style,
                    translateX: xPerc,
                    translateY: yPerc,
                  },
                }
                : text
            )
          )
        }
      }}
      scalable={true}
      keepRatio={true}
      onScale={(e) => {
        e.target.style.transform = e.drag.transform
      }}
      rotatable={true}
      rotationPosition={'top'}
      onRotate={(e) => {
        e.target.style.transform = e.drag.transform
      }}
      snapRotationThreshold={5}
      snapRotationDegrees={[0, 90, 180, 270]}
      snappable={true}
      snapDirections={{
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      }}
      snapThreshold={7}
      horizontalGuidelines={[
        domHeight / 2 / scaleFactor / quality,
        domHeight / 1 / scaleFactor / quality,
        0,
      ]}
      verticalGuidelines={[
        domWidth / 2 / scaleFactor / quality,
        domWidth / 1 / scaleFactor / quality,
        0,
      ]}
      elementSnapDirections={{
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      }}
      elementGuidelines={elementGuidelines}
    />
  )
}
