"use client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import useTiptapEditor from '@/hooks/use-editor'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { cn, convertHexToRgba } from '@/lib/utils'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/react'
import { Bold, Italic } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Button } from '../ui/button'
import ContextMenuText from './text-context-menu'

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
                        <Italic className={cn('h-4 w-4 dark:text-gray-100 text-black', editor.isActive('italic') ? "italic" : "")} />
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

function TipTapEditor({ textContent, onContentChange }: { textContent: string; onContentChange: (content: string) => void }) {
    const { setShowTextControls, isEditable, setIsEditable } = useMoveable()
    const { texts, setTexts } = useImageOptions()
    const { selectedText } = useSelectedLayers()
    const editorRef = useRef<HTMLDivElement>(null)
    const displayContent = textContent || 'Edit this text'
    const { editor } = useTiptapEditor(displayContent)

    useEffect(() => {
        if (editor && displayContent !== editor.getText()) {
            editor.commands.setContent(displayContent)
        }
    }, [editor, displayContent])

    useEffect(() => {
        // TODO: we need to listen for more than just color and content
        if (!editor) return
        const handleUpdate = () => {
            const plainText = editor.getText()
            if (plainText !== textContent) {
                onContentChange(plainText)
            }
            if (selectedText) {
                const editorColor = editor.getAttributes('textStyle').color as string | undefined
                if (editorColor) {
                    const current = texts.find((t) => t.id === selectedText)
                    if (current && current.style.textColor !== editorColor) {
                        setTexts(
                            texts.map((t) =>
                                t.id === selectedText
                                    ? {
                                        ...t,
                                        style: {
                                            ...t.style,
                                            textColor: editorColor,
                                        },
                                    }
                                    : t
                            )
                        )
                    }
                }
            }
        }

        editor.on('update', handleUpdate)
        return () => {
            editor.off('update', handleUpdate)
        }
    }, [editor, textContent, onContentChange, selectedText, texts, setTexts])

    // TODO: fix weird bug where highlight remains after this event
    useOnClickOutside(editorRef, () => {
        if (isEditable) {
            editor?.commands.blur()
            setIsEditable(false)
        }
    })

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        editor?.chain().selectAll().focus()
        setIsEditable(true)
        setShowTextControls(false)
    }

    return (
        <div
            ref={editorRef}
            onDoubleClick={handleDoubleClick}
            className="relative w-full h-full min-w-fit min-h-fit"
            style={{
                position: 'relative',
                zIndex: isEditable ? 10 : 'auto',
                margin: 0,
                padding: 0,
            }}
        >
            <BubbleMenuComp editor={editor} />
            <div
                className={cn(
                    "w-full h-full relative min-w-fit min-h-fit",
                    isEditable ? 'pointer-events-auto cursor-text' : 'pointer-events-none cursor-move'
                )}
            >
                <EditorContent
                    editor={editor}
                    className="h-full w-full relative"
                />
            </div>
        </div>
    )
}

export default function TextLayers() {
    const textRef = useRef<HTMLDivElement>(null)

    const { setShowTextControls, setShowControls } = useMoveable()
    const { texts, setTexts } = useImageOptions()
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
                            className={cn(
                                "text apply-font absolute cursor-pointer image",
                                text.content === '' ? 'pointer-events-none hidden' : ''
                            )}
                            // transformations? handled by moveable
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
                                width: 'fit-content',
                                height: 'fit-content',
                                minWidth: '2ch',
                                minHeight: '1em',
                                // only apply transforms when text is NOT selected
                                ...(selectedText !== text.id && (text.style.translateX !== 0 || text.style.translateY !== 0 ||
                                    text.style.scaleX !== 1 || text.style.scaleY !== 1 ||
                                    text.style.rotate !== 0) ? {
                                    transform: `perspective(${text.style.perspective ?? 1000}px) translate(${text.style.translateX ?? 0}px, ${text.style.translateY ?? 0}px) scale(${text.style.scaleX ?? 1}, ${text.style.scaleY ?? 1}) rotate(${text.style.rotate ?? 0}deg) rotateX(${text.style.rotateX ?? 0}deg) rotateY(${text.style.rotateY ?? 0}deg) rotateZ(${text.style.rotateZ ?? 0}deg)`,
                                    willChange: 'transform',
                                } : {}),
                            }}
                            onContextMenu={(e) => {
                                e.stopPropagation()
                                setShowTextControls(true)
                                setSelectedText(text.id)
                                setSelectedImage(null)
                                setShowControls(false)
                            }}
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowTextControls(true)
                                setSelectedText(text.id)
                                setSelectedImage(null)
                                setShowControls(false)
                            }}
                        >
                            <TipTapEditor
                                textContent={text.content}
                                onContentChange={(content) => {
                                    setTexts(
                                        texts.map((t) =>
                                            t.id === text.id
                                                ? { ...t, content }
                                                : t
                                        )
                                    )
                                }}
                            />
                        </div>
                    </ContextMenuText>
                )
            })}
        </>
    )
}