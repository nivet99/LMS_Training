"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createReply } from "@/actions/webboard/reply";
import type { CreateReplyState } from "@/actions/webboard/reply";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="plearn-btn plearn-btn-primary"
    >
      {pending ? "กำลังโพสต์..." : "โพสต์ความคิดเห็น"}
    </button>
  );
}

const initialState: CreateReplyState = {};

export function ReplyForm({ postId }: { postId: string }) {
  const boundReply = createReply.bind(null, postId);
  const [state, action] = useFormState(boundReply, initialState);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-3">
      <textarea
        name="content"
        rows={4}
        placeholder="แสดงความคิดเห็น แบ่งปันประสบการณ์ หรือตอบคำถาม..."
        className="w-full px-4 py-3 rounded-lg border text-body-s resize-none"
        style={{
          borderColor: fe.content ? "var(--vermilion)" : "var(--line)",
          background: "var(--cream)",
          color: "var(--ink)",
          outline: "none",
          lineHeight: 1.6,
        }}
      />
      {fe.content && (
        <p className="text-caption" style={{ color: "var(--vermilion)" }}>{fe.content}</p>
      )}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
