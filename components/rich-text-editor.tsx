"use client"

import { useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current && value) {
      editorRef.current.innerHTML = value
      isInitializedRef.current = true
    }
  }, [value])

  // Reset when value becomes empty (for form reset)
  useEffect(() => {
    if (editorRef.current && value && !isInitializedRef.current) {
      editorRef.current.innerHTML = value
      isInitializedRef.current = true
    }
  }, [value])

  // Format selection with execCommand
  const formatText = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [])

  // Handle input changes - just report the change, don't re-render
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  // Handle paste - allow formatted paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  // Toolbar button component
  const ToolbarButton = ({ icon: Icon, command, title }: { icon: React.ElementType, command: string, title: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => formatText(command)}
      title={title}
      className="h-8 w-8 p-0 hover:bg-gray-200"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-white dark:bg-gray-900", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b">
        <ToolbarButton icon={Bold} command="bold" title="Bold (Ctrl+B)" />
        <ToolbarButton icon={Italic} command="italic" title="Italic (Ctrl+I)" />
        <ToolbarButton icon={Underline} command="underline" title="Underline (Ctrl+U)" />
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className={cn(
          "min-h-[400px] p-4 outline-none",
          "text-sm leading-relaxed",
          "focus:ring-0",
          "overflow-y-auto"
        )}
        style={{ 
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }}
        suppressContentEditableWarning
      />

      {/* Placeholder styles */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: "${placeholder || 'Start typing...'}";
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] b, [contenteditable] strong {
          font-weight: 700;
        }
        [contenteditable] i, [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
        }
      `}</style>
    </div>
  )
}
