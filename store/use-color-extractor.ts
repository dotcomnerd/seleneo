import { create } from 'zustand'

interface ActiveIndexState {
  extractedColor: object
  setExtractedColor: (extractedColor: object) => void

  imagesCheck: string[]
  setImagesCheck: (imagesCheck: string[]) => void
}

export const useColorExtractor = create<ActiveIndexState>()((set) => ({
  extractedColor: {},
  setExtractedColor: (extractedColor) => set(() => ({ extractedColor })),

  imagesCheck: [],
  setImagesCheck: (imagesCheck) => set(() => ({ imagesCheck })),
}))
