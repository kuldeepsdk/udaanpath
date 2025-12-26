"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as U, List, ListOrdered, Code, Quote, Eraser } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function QuestionEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Superscript,
      Subscript,
      Underline,
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md border text-slate-600
        ${active ? "bg-blue-100 border-blue-300 text-blue-700" : "hover:bg-slate-100"}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border bg-white">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-slate-50 p-2">

        <Btn
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={14} />
        </Btn>

        <Btn
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={14} />
        </Btn>

        <Btn
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <U size={14} />
        </Btn>

        <Btn
          title="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive("superscript")}
        >
          x²
        </Btn>

        <Btn
          title="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive("subscript")}
        >
          x₂
        </Btn>

        <Btn
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={14} />
        </Btn>

        <Btn
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={14} />
        </Btn>

        <Btn
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={14} />
        </Btn>

        <Btn
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          <Code size={14} />
        </Btn>

        <Btn
          title="Clear Formatting"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Eraser size={14} />
        </Btn>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[160px] max-h-[300px] overflow-y-auto focus:outline-none"
      />
    </div>
  );
}
