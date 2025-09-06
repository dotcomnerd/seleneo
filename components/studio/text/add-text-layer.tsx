'use client'

import { Button } from '@/components/ui/button'
import { useImageOptions } from '@/store/use-image-options'
import { Plus } from 'lucide-react'

export default function AddTextLayer() {
  const { setTexts, defaultTextStyle, texts, setInitialImageUploaded } = useImageOptions()

  return (
    <Button
      onClick={() => {
        setTexts([
          ...texts,
          {
            content: 'Edit this text',
            id: texts.length > 0 ? Math.max(...texts.map(t => t.id)) + 1 : 1,
            style: defaultTextStyle,
          },
        ])
        setInitialImageUploaded(true)
      }}
      size="lg"
      variant="stylish"
      className="w-full rounded-lg text-center text-base border-2 border-primary/20 hover:border-primary/40"
    >
      <Plus size={22} className="mr-2 inline-block align-middle" />
      <span>Add a text layer</span>
    </Button>
  )
}
