"use client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import useTiptapEditor from '@/hooks/use-editor'
import { cn, convertHexToRgba } from '@/lib/utils'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react'
import { useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button } from '../ui/button'
import ContextMenuText from './text-context-menu'
import { Bold, Italic } from 'lucide-react'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

type MenuBarProps = {
    editor: Editor | null
}

const BubbleMenuComp = ({ editor }: MenuBarProps) => {
    if (!editor) {
        return null
    }

    return (
        <>
            <BubbleMenu
                className="flex flex-col gap-2 bg-card rounded-lg shadow-lg p-4 border border-primary/10 dark:border-primary/20"
                tippyOptions={{
                    duration: 100,
                    followCursor: true,
                    placement: 'auto-end',
                }}
                editor={editor}
            >
                <div className="flex items-center gap-2 border-b border-card pb-2">
                    <Button
                        onClick={() => {
                            const { selection } = editor.state;
                            if (selection.empty) {
                                editor.chain().focus().selectAll().toggleBold().run();
                            } else {
                                editor.chain().focus().toggleBold().run();
                            }
                        }}
                        variant={editor.isActive('bold') ? "secondary" : "ghost"}
                        className="h-8 w-8 p-0"
                    >
                        <Bold className={cn('h-4 w-4 dark:text-gray-100 text-black', editor.isActive('bold') ? 'font-bold' : 'font-normal')} />
                    </Button>
                    <Button
                        onClick={() => {
                            const { selection } = editor.state;
                            if (selection.empty) {
                                editor.chain().focus().selectAll().toggleItalic().run();
                            } else {
                                editor.chain().focus().toggleItalic().run();
                            }
                        }}
                        variant={editor.isActive('italic') ? "secondary" : "ghost"}
                        className={cn('h-8 w-8 p-0')}
                    >
                        <Italic className={cn('h-4 w-4 dark:text-gray-100 text-black', editor.isActive('italic') ? "italic":"")} />
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-48">
                        <HexColorPicker
                            color={editor.getAttributes('textStyle').color}
                            onChange={(color) => {
                                editor.chain().focus().setColor(color).run();
                            }}
                            className="w-full"
                        />
                    </div>
                </div>
            </BubbleMenu>
        </>
    )
}

function TipTapEditor() {
    const { setShowTextControls, isEditable, setIsEditable } = useMoveable()
    const { defaultStyle } = useImageOptions()
    const editorRef = useRef<HTMLDivElement>(null)
    const { editor } = useTiptapEditor()
    // TODO: fix weird bug where highlight remains after this event
    useOnClickOutside(editorRef, () => {
        if (isEditable) {
            editor?.commands.blur()
            setIsEditable(false)
        }
    })

    return (
        <div
            ref={editorRef}
            onDoubleClick={() => {
                editor?.chain().selectAll().focus()
                setIsEditable(true)
                setShowTextControls(false)
            }}
        >
            <BubbleMenuComp editor={editor} />
            <div
                className={`${isEditable ? 'pointer-events-auto cursor-text' : 'pointer-events-none'
                    }`}
            >
                <EditorContent style={defaultStyle} editor={editor} />
            </div>
        </div>
    )
}

export default function TextLayers() {
    const textRef = useRef<HTMLDivElement>(null)

    const { setShowTextControls, setShowControls } = useMoveable()
    const { texts } = useImageOptions()
    const { selectedText, setSelectedText, setSelectedImage } =
        useSelectedLayers()

    return (
        <>
            {texts.map((text, index) => {
                return (
                    <ContextMenuText key={text.id + index}>
                        <div
                            key={`text-${text.id}`}
                            id={`text-${text.id}`}
                            ref={text.id === selectedText ? textRef : null}
                            className={`text apply-font absolute flex-1 cursor-pointer  ${text.content === '' ? 'pointer-events-none hidden' : 'image'
                                }`}
                            style={{
                                fontSize: `${text.style.textSize}rem`,
                                fontFamily: text.style.fontFamily,
                                color: `${text.style.textColor}`,
                                fontWeight: `${text.style.fontWeight}`,
                                textAlign: `${text.style.textAlign}`,
                                letterSpacing: `${text.style.letterSpacing}em`,
                                filter: `drop-shadow(${text.style.textShadow
                                    } ${convertHexToRgba(
                                        text.style.shadowColor,
                                        text.style.shadowOpacity
                                    )})`,
                                lineHeight: '1',
                                zIndex: `${text.style.zIndex}`,
                            }}
                            onContextMenu={() => {
                                setShowTextControls(true)
                                setSelectedText(text.id)
                                setSelectedImage(null)
                                setShowControls(false)
                            }}
                            onClick={() => {
                                setShowTextControls(true)
                                setSelectedText(text.id)
                                setSelectedImage(null)
                                setShowControls(false)
                            }}
                            // TODO: Allow dragging without text selection?
                        >
                            <TipTapEditor />
                        </div>
                    </ContextMenuText>
                )
            })}
        </>
    )
}