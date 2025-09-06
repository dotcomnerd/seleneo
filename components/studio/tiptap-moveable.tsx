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
      }, 50)
    }
  }, [texts, selectedText])

  // make sure saved position is applied when text is restored from JSON
  useEffect(() => {
    if (selectedText && typeof document !== 'undefined') {
      const textElement = texts.find(text => text.id === selectedText)
      const domElement = document.getElementById(`text-${selectedText}`)

      if (textElement && domElement && moveableRef.current) {
        if (textElement.style.translateX !== 0 || textElement.style.translateY !== 0 ||
          textElement.style.scaleX !== 1 || textElement.style.scaleY !== 1 ||
          textElement.style.rotate !== 0) {
          const transform = `perspective(${textElement.style.perspective ?? 1000}px) translate(${textElement.style.translateX ?? 0}px, ${textElement.style.translateY ?? 0}px) scale(${textElement.style.scaleX ?? 1}, ${textElement.style.scaleY ?? 1}) rotate(${textElement.style.rotate ?? 0}deg) rotateX(${textElement.style.rotateX ?? 0}deg) rotateY(${textElement.style.rotateY ?? 0}deg) rotateZ(${textElement.style.rotateZ ?? 0}deg)`
          domElement.style.transform = transform
        }

        // let DOM update first then update moveable
        setTimeout(() => {
          moveableRef.current?.updateRect()
        }, 10)
      }
    }
  }, [selectedText])

  return (
    <Moveable
      ref={moveableRef}
      target={
        typeof document !== 'undefined' ? document?.getElementById(id) : ''
      }
      draggable={true}
      onDragStart={({ set }) => {
        if (selectedText) {
          const textElement = texts.find(text => text.id === selectedText)
          if (textElement) {
            set([textElement.style.translateX || 0, textElement.style.translateY || 0])
          }
        } else {
          set([0, 0])
        }
      }}
      onDrag={(e) => {
        e.target.style.transform = e.transform
      }}
      onDragEnd={({ target, lastEvent }) => {
        if (selectedText && lastEvent?.translate) {
          const translateX = lastEvent.translate[0]
          const translateY = lastEvent.translate[1]

          setTexts(
            texts.map((text) =>
              text.id === selectedText
                ? {
                  ...text,
                  style: {
                    ...text.style,
                    translateX: translateX,
                    translateY: translateY,
                  },
                }
                : text
            )
          )
        }
      }}
      scalable={true}
      keepRatio={true}
      onScaleStart={({ set, dragStart }) => {
        if (selectedText) {
          const textElement = texts.find(text => text.id === selectedText)
          if (textElement) {
            set([textElement.style.scaleX || 1, textElement.style.scaleY || 1])
            if (dragStart) {
              dragStart.set([textElement.style.translateX || 0, textElement.style.translateY || 0])
            }
          }
        } else {
          set([1, 1])
          if (dragStart) {
            dragStart.set([0, 0])
          }
        }
      }}
      onScale={(e) => {
        e.target.style.transform = e.drag.transform
      }}
      onScaleEnd={({ target, lastEvent }) => {
        if (!lastEvent || !selectedText) return

        const scaleX = lastEvent.scale[0]
        const scaleY = lastEvent.scale[1]
        const translateX = lastEvent.drag?.translate[0] || 0
        const translateY = lastEvent.drag?.translate[1] || 0

        setTexts(
          texts.map((text) =>
            text.id === selectedText
              ? {
                ...text,
                style: {
                  ...text.style,
                  scaleX: scaleX,
                  scaleY: scaleY,
                  translateX: translateX,
                  translateY: translateY,
                },
              }
              : text
          )
        )
      }}
      rotatable={true}
      rotationPosition={'top'}
      onRotateStart={({ set }) => {
        if (selectedText) {
          const textElement = texts.find(text => text.id === selectedText)
          if (textElement) {
            set(textElement.style.rotate || 0)
          }
        } else {
          set(0)
        }
      }}
      onRotate={(e) => {
        e.target.style.transform = e.drag.transform
      }}
      onRotateEnd={({ lastEvent }) => {
        if (!lastEvent || !selectedText) return

        const rotate = lastEvent.rotate || 0
        const translateX = lastEvent.drag?.translate[0] || 0
        const translateY = lastEvent.drag?.translate[1] || 0

        setTexts(
          texts.map((text) =>
            text.id === selectedText
              ? {
                ...text,
                style: {
                  ...text.style,
                  rotate: rotate,
                  translateX: translateX,
                  translateY: translateY,
                },
              }
              : text
          )
        )
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
