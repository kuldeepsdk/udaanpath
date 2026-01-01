"use client";

import { useState } from "react";
import QuestionForm from "../components/QuestionForm";
import BulkQuestionUploadModal from "../components/BulkQuestionUploadModal";

export default function CreateQuestionPage() {
  const [openBulk, setOpenBulk] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Create Question
        </h1>
        {/*}
        <button
          onClick={() => setOpenBulk(true)}
          className="rounded-lg bg-blue-100 text-blue-700
                     px-4 py-2 text-sm font-medium
                     hover:bg-blue-200"
        >
          ⬆️ Bulk Upload (CSV)
        </button>
        */}
      </div>

      {/* Single Question Form */}
      <QuestionForm />

      {/* Bulk Upload Modal */}
      <BulkQuestionUploadModal
        open={openBulk}
        onClose={() => setOpenBulk(false)}
      />
    </>
  );
}
