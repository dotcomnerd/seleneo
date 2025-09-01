'use client'

import PopupColorPicker from '@/components/popup-color-picker'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { solidColors } from '@/presets/solid-colors'
import { useBackgroundOptions } from '@/store/use-background-options'
import { Palette } from 'lucide-react'
import { useCallback } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'

export default function CustomGradientPicker() {
  const {
    setBackground,
    background,
    setBackgroundType,
    solidColor,
    setSolidColor,
    setImageBackground,
    imageBackground,
  } = useBackgroundOptions()

  const updateRootStyles = useCallback((color: string) => {
    if (typeof window === 'undefined') return
    document?.documentElement.style.setProperty('--solid-bg', color)
    document?.documentElement.style.setProperty('--gradient-bg', color)
    document?.documentElement.style.setProperty('--mesh-bg', color)
  }, [])

  const handleColorChange = useCallback(
    (color: string) => {
      setBackgroundType('solid')
      setSolidColor(color)
      setBackground(color)
      console.log("DEBUG: Color: ", color)
      setImageBackground(null)
      updateRootStyles(color)
    },
    [
      setSolidColor,
      setBackground,
      setBackgroundType,
      updateRootStyles,
      setImageBackground,
    ]
  )

  return (
    <>
      <div>
        <h3 className="mb-3 mt-8 flex items-center gap-2 text-xs font-medium uppercase text-dark/70">
          <span>Color Picker</span>
        </h3>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                      >
                          <Palette className="h-4 w-4" />
                            <span>{solidColor || 'Pick a color'}</span>
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                      <HexColorPicker
                          color={solidColor || '#fff'}
                          onChange={handleColorChange}
                      />
                      <div className="mt-4">
                          <HexColorInput
                              tabIndex={0}
                              prefix='#'
                              prefixed
                              color={solidColor || '#fff'}
                              onChange={handleColorChange}
                              className="w-full rounded-md border px-2 py-1"
                          />
                      </div>
                  </PopoverContent>
              </Popover>
      </div>

      <div>
        <h3 className="mt-8 flex items-center gap-2 text-xs font-medium uppercase text-dark/70">
          <span>Solid Colors:</span>
        </h3>

        <div className="mt-4 flex grid-cols-5 flex-wrap gap-x-2.5 gap-y-3 md:grid w-full">
          {solidColors.slice(0, 1).map(({ background: solidBackground }) => {
            return (
              <Button
                key={solidBackground}
                className={`aspect-square overflow-hidden rounded-sm p-0 ${
                  background === solidBackground &&
                  !imageBackground &&
                  'outline-none ring-2 ring-ring ring-offset-2'
                }`}
                onClick={() => handleColorChange(solidBackground)}
                style={{ background: solidBackground }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full scale-150"
                  src="/transparent.jpg"
                  alt="transparent background"
                />
              </Button>
            )
          })}
          {solidColors.slice(1).map(({ background: solidBackground }) => {
            return (
              <Button
                key={solidBackground}
                variant="secondary"
                className={`h-[2.56rem] w-[2.56rem] rounded-md ${
                  background === solidBackground &&
                  !imageBackground &&
                  'outline-none ring-2 ring-ring ring-offset-2'
                }`}
                onClick={() => handleColorChange(solidBackground)}
                style={{ background: solidBackground }}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
