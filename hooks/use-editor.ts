import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'

export default function useTiptapEditor() {
  const editor = useEditor({
      extensions: [StarterKit, Color, TextStyle, FontFamily, Document, Paragraph, Text, TextStyle, TextAlign],
    content: 'Double click to edit',
  })

  return { editor }
}
