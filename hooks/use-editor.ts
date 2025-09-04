import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function useTiptapEditor(initialContent: string = '') {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color.configure({
                types: ['textStyle'],
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'center',
            }),
        ],
        content: initialContent,
        onCreate: ({ editor }) => {
            editor.commands.selectAll()
            editor.commands.setTextAlign('center')
        }
    })

    return { editor }
}