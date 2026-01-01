"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PaperHeader from "./components/PaperHeader";
import PaperQuestionTable from "./components/PaperQuestionTable";
import AddQuestionsModal from "./components/AddQuestionsModal";
import EditPaperModal from "./components/EditPaperModal";
import { getPaperPreviewAction } from "@/app/actions/ueas/papers.actions";

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.paperId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  async function loadPaper() {
    setLoading(true);
    try {
      const res = await getPaperPreviewAction(paperId);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (paperId) loadPaper();
  }, [paperId]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading paper…</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-600">Paper not found</div>;
  }

  return (
    <>
      {/* HEADER */}
      <PaperHeader
        paper={data.paper}
        onAddQuestions={() => setOpenAdd(true)}
        onEditPaper={() => setOpenEdit(true)}
      />

      {/* QUESTIONS */}
      <PaperQuestionTable
        questions={data.questions}
        paperId={paperId}
        onChange={loadPaper}
      />

      {/* ADD QUESTIONS MODAL */}
      <AddQuestionsModal
        open={openAdd}
        paperId={paperId}
        onClose={() => setOpenAdd(false)}
        onAdded={loadPaper}
      />

      {/* EDIT PAPER MODAL */}
      <EditPaperModal
        open={openEdit}
        paper={data.paper}
        onClose={() => setOpenEdit(false)}
        onUpdated={() => {
          setOpenEdit(false);
          loadPaper();
        }}
      />
    </>
  );
}
