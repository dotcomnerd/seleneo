'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

type Props = {
  text: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  as?: 'button' | 'div'
}

export default function SpotlightButton({
  text,
  onClick,
  className,
  disabled,
  as = 'button',
}: Props) {
  const As = as

  return (
    <As
      disabled={disabled}
      onClick={onClick}
      className={cn(
        `group relative mx-auto inline-flex h-8 items-center overflow-hidden rounded-xl bg-primary/10 px-5 transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50 ${
          as === 'div' ? 'cursor-not-allowed opacity-50' : ''
        }`,
        className
      )}
      style={{
        transition: 'background 0.8s cubic-bezier(0.6, 0.6, 0, 1)',
      }}
    >
      <div className="absolute inset-0 flex items-center [container-type:inline-size]">
        <div className="absolute h-[100cqw] w-[100cqw] animate-spin bg-[conic-gradient(from_0_at_50%_50%,rgba(255,255,255,0.5)_0deg,transparent_60deg,transparent_300deg,rgba(255,255,255,0.5)_360deg)] opacity-100 transition duration-300  [animation-duration:3s]"></div>
      </div>

      <div className="absolute inset-0.5 rounded-xl bg-primary dark:bg-[#121212]"></div>

      <div className="absolute bottom-0 left-1/2  h-2/3 w-4/5 -translate-x-1/2 rounded-xl bg-white/10 opacity-100 blur-md transition-all duration-500"></div>

      <span className="flex-center relative gap-2 bg-gradient-to-b from-white/25  to-white bg-clip-text text-[0.95rem] font-semibold text-transparent transition-all duration-200 group">
        {text}
        <Star
          size={20}
          style={{
            transition: 'all 1s cubic-bezier(0.6, 0.6, 0, 1)',
          }}
          className="stroke-[2] text-yellow-400 group-hover:rotate-[287deg] group-hover:fill-yellow-400"
        />
      </span>
    </As>
  )
}
