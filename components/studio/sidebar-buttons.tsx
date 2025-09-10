'use client'

import { Button } from '@/components/ui/button'
import { useActiveIndexStore } from '@/store/use-active-index'
import { useDrawingTools } from '@/store/use-drawing'

export default function SidebarButton({
  icon,
  text,
  index,
}: {
  text?: string
  icon: React.ReactNode
  index: number
}) {
  const activeIndex = useActiveIndexStore((state) => state.activeIndex)
  const setActiveIndex = useActiveIndexStore((state) => state.setActiveIndex)
  const { setCurrentTool, currentTool } = useDrawingTools()

  const handleClick = () => {
    setActiveIndex(index)
    if (index === 4) setCurrentTool('pen');
    else if (activeIndex === 4 && currentTool !== 'select') setCurrentTool('select');
  }

  return (
    <li
      onClick={handleClick}
      className={`click-ignored relative flex flex-col items-center gap-2`}
    >
      <Button
        className={`h-11 rounded-xl px-3 py-2 md:h-12 md:px-4 md:py-3`}
        variant={activeIndex === index ? "activeIcon" : 'icon'}
        aria-label={`${text} options`}
      >
        {icon}
      </Button>
      {text && (
        <span
          className={`hidden max-w-[3.25rem] truncate text-xs md:inline`}
        >
          {text}
        </span>
      )}
    </li>
  )
}
