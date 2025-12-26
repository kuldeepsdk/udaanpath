"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function AnalysisEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        codeBlock: false,
        blockquote: false,
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn =
    "p-2 rounded hover:bg-slate-100 text-slate-700";

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        Solution / Analysis
      </label>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border rounded-t-lg bg-slate-50 px-2 py-1">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn}>
          <Italic size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn}>
          <List size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn}>
          <ListOrdered size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn}>
          <Quote size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn}>
          <Code size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="border border-t-0 rounded-b-lg bg-white">
        <EditorContent
          editor={editor}
          className="px-3 py-3 min-h-[180px]"
        />
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Explain correct answer, steps, formulas, logic
      </p>
    </div>
  );
}
