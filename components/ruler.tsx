import { useRef, useEffect } from 'react'

interface RulerProps {
  orientation: 'horizontal' | 'vertical'
  length: number
}

export function Ruler({ orientation, length }: RulerProps) {
  const rulerRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (rulerRef.current) {
      const ctx = rulerRef.current.getContext('2d')
      if (ctx) {
        drawRuler(ctx)
      }
    }
  }, [orientation, length])

  const drawRuler = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = '#000'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const step = 10
    const majorStep = 100

    for (let i = 0; i <= length; i += step) {
      const pos = i
      if (orientation === 'horizontal') {
        ctx.moveTo(pos, ctx.canvas.height)
        ctx.lineTo(pos, i % majorStep === 0 ? 0 : ctx.canvas.height / 2)
        if (i % majorStep === 0) {
          ctx.fillText(i.toString(), pos, ctx.canvas.height / 2)
        }
      } else {
        ctx.moveTo(0, pos)
        ctx.lineTo(i % majorStep === 0 ? ctx.canvas.width : ctx.canvas.width / 2, pos)
        if (i % majorStep === 0) {
          ctx.save()
          ctx.translate(ctx.canvas.width / 2, pos)
          ctx.rotate(-Math.PI / 2)
          ctx.fillText(i.toString(), 0, 0)
          ctx.restore()
        }
      }
    }

    ctx.strokeStyle = '#000'
    ctx.stroke()
  }

  return (
    <canvas
      ref={rulerRef}
      width={orientation === 'horizontal' ? length : 30}
      height={orientation === 'vertical' ? length : 30}
      className={`absolute ${
        orientation === 'horizontal' ? 'top-0 left-8' : 'left-0 top-8'
      } bg-gray-100 dark:bg-gray-800`}
    />
  )
}

