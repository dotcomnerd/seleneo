export const FILE_TYPES = ['PNG', 'JPG', 'WEBP', 'SVG'] as const
export type FileType = typeof FILE_TYPES[number]

export const QUALITY_OPTIONS = [
    { label: '1x - 1024px', value: 1 },
    { label: '2x - 2048px', value: 2 },
    { label: '3x - 3072px', value: 3 },
    { label: '4x - 4096px', value: 4 },
] as const

export type QualityOption = typeof QUALITY_OPTIONS[number]