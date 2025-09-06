import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function useTiptapEditor(initialContent: string = '') {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        style: 'margin: 0; padding: 0;'
                    }
                }
            }),
            TextStyle,
            Color.configure({
                types: ['textStyle'],
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],

            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                style: 'outline: none; margin: 0; padding: 0; width: 100%; height: 100%; overflow: visible;'
            }
        }
    })

    return { editor }
}