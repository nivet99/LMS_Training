"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MockQuiz } from "@/mock";
import { submitQuizAttempt } from "@/actions/quizzes/attempt";

interface QuizEngineProps {
  quiz: MockQuiz;
  lessonTitle: string;
  onComplete: (passed: boolean, score: number) => void;
  userId?: string;
}

type Phase = "intro" | "playing" | "result";

type StoredAttempt = { quizId: string; score: number; passed: boolean; timeTaken: number };

function readPastAttempts(userId: string, quizId: string): StoredAttempt[] {
  if (typeof document === "undefined") return [];
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`quiz_attempts_${userId}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  if (!raw) return [];
  try {
    const all: StoredAttempt[] = JSON.parse(decodeURIComponent(raw));
    return all.filter((a) => a.quizId === quizId).slice(-5).reverse();
  } catch {
    return [];
  }
}

export function QuizEngine({ quiz, lessonTitle, onComplete, userId }: QuizEngineProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSecs ?? 0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<StoredAttempt[]>([]);
  const startedAtRef = useRef<number>(Date.now());

  const totalQ = quiz.questions.length;
  const currentQ = quiz.questions[currentIdx];

  // Timer countdown — intentionally omits handleFinish/answers/quiz.timeLimitSecs to avoid re-creating interval on every answer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (phase !== "playing" || !quiz.timeLimitSecs) return;
    if (timeLeft <= 0) { handleFinish(answers); return; }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinish = useCallback(async (finalAnswers: number[]) => {
    let earned = 0;
    let total = 0;
    quiz.questions.forEach((q, i) => {
      total += q.points;
      if (finalAnswers[i] === q.correctIndex) earned += q.points;
    });
    const scorePercent = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = scorePercent >= quiz.passingScore;
    const timeTaken = Math.round((Date.now() - startedAtRef.current) / 1000);

    await submitQuizAttempt({ quizId: quiz.id, score: scorePercent, passed, timeTaken });
    onComplete(passed, scorePercent);
    setPhase("result");
    // Load history after cookie is written
    if (userId) {
      setTimeout(() => setPastAttempts(readPastAttempts(userId, quiz.id)), 200);
    }
  }, [quiz, onComplete, userId]);

  function handleSelect(idx: number) {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
  }

  function handleNext() {
    const newAnswers = [...answers, selected ?? -1];
    setAnswers(newAnswers);
    setShowAnswer(false);
    setSelected(null);
    if (currentIdx + 1 >= totalQ) {
      handleFinish(newAnswers);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "var(--vermilion-soft)" }}>
          <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="var(--vermilion)" strokeWidth="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-h2 mb-2" style={{ color: "var(--ink)" }}>{lessonTitle}</h2>
        <div className="flex gap-6 mb-8 text-center">
          <div>
            <p className="font-serif font-medium text-2xl" style={{ color: "var(--ink)" }}>{totalQ}</p>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>คำถาม</p>
          </div>
          {quiz.timeLimitSecs && (
            <div>
              <p className="font-serif font-medium text-2xl" style={{ color: "var(--ink)" }}>
                {formatTime(quiz.timeLimitSecs)}
              </p>
              <p className="text-caption" style={{ color: "var(--ink-3)" }}>เวลา</p>
            </div>
          )}
          <div>
            <p className="font-serif font-medium text-2xl" style={{ color: "var(--ink)" }}>{quiz.passingScore}%</p>
            <p className="text-caption" style={{ color: "var(--ink-3)" }}>คะแนนผ่าน</p>
          </div>
        </div>
        <button
          className="plearn-btn plearn-btn-primary plearn-btn-lg"
          onClick={() => { setPhase("playing"); setTimeLeft(quiz.timeLimitSecs ?? 0); }}
        >
          เริ่มทำแบบทดสอบ
        </button>
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (phase === "result") {
    let earned = 0, total = 0;
    quiz.questions.forEach((q, i) => {
      total += q.points;
      if (answers[i] === q.correctIndex) earned += q.points;
    });
    const scorePercent = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = scorePercent >= quiz.passingScore;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Badge */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: passed ? "var(--pine-soft, #E8F5E9)" : "var(--vermilion-soft)" }}>
          {passed ? (
            <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="var(--pine)" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="var(--vermilion)" strokeWidth="2">
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <h2 className="text-h2 mb-1" style={{ color: "var(--ink)" }}>
          {passed ? "ยินดีด้วย! ผ่านแล้ว" : "ยังไม่ผ่าน ลองอีกครั้ง"}
        </h2>
        <p className="text-body mb-6" style={{ color: "var(--ink-3)" }}>
          {passed ? "คุณทำได้ดีมาก!" : `ต้องได้อย่างน้อย ${quiz.passingScore}% เพื่อผ่าน`}
        </p>

        {/* Score */}
        <div className="rounded-2xl border px-12 py-6 mb-8"
          style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
          <p className="font-serif font-medium mb-1"
            style={{ fontSize: "56px", lineHeight: 1, color: passed ? "var(--pine)" : "var(--vermilion)" }}>
            {scorePercent}%
          </p>
          <p className="text-caption" style={{ color: "var(--ink-3)" }}>
            {earned}/{total} คะแนน
          </p>
        </div>

        {/* Per-question summary */}
        <div className="w-full max-w-md text-left space-y-2 mb-8">
          {quiz.questions.map((q, i) => {
            const correct = answers[i] === q.correctIndex;
            return (
              <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: correct ? "var(--pine-soft, #E8F5E9)" : "var(--vermilion-soft)" }}>
                <span style={{ color: correct ? "var(--pine)" : "var(--vermilion)", flexShrink: 0 }}>
                  {correct ? "✓" : "✗"}
                </span>
                <div className="text-body-s flex-1" style={{ color: "var(--ink)" }}>
                  <p className="font-medium">{q.content}</p>
                  {!correct && (
                    <p className="text-caption mt-0.5" style={{ color: "var(--pine)" }}>
                      เฉลย: {q.options[q.correctIndex]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Past attempt history */}
        {pastAttempts.length > 0 && (
          <div className="w-full max-w-md mb-8">
            <p className="text-caption font-medium mb-3 text-left" style={{ color: "var(--ink-3)" }}>
              ประวัติการทำแบบทดสอบ (ล่าสุด {pastAttempts.length} ครั้ง)
            </p>
            <div className="space-y-2">
              {pastAttempts.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-4 py-2.5 border"
                  style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: a.passed ? "var(--pine-soft, #E8F5E9)" : "var(--vermilion-soft)" }}>
                      <span style={{ fontSize: "10px", color: a.passed ? "var(--pine)" : "var(--vermilion)" }}>
                        {a.passed ? "✓" : "✗"}
                      </span>
                    </span>
                    <span className="text-body-s" style={{ color: "var(--ink-3)" }}>
                      {i === 0 ? "ครั้งนี้" : `ครั้งที่ ${pastAttempts.length - i}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-medium"
                      style={{ color: a.passed ? "var(--pine)" : "var(--vermilion)" }}>
                      {a.score}%
                    </span>
                    <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                      {Math.floor(a.timeTaken / 60)}:{(a.timeTaken % 60).toString().padStart(2, "0")} น.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!passed && (
            <button
              className="plearn-btn plearn-btn-line plearn-btn-lg"
              onClick={() => {
                setPhase("intro");
                setCurrentIdx(0);
                setAnswers([]);
                setSelected(null);
                setShowAnswer(false);
              }}
            >
              ลองใหม่
            </button>
          )}
          <button
            className="plearn-btn plearn-btn-primary plearn-btn-lg"
            onClick={() => onComplete(passed, scorePercent)}
          >
            {passed ? "บทเรียนถัดไป" : "กลับไปทบทวน"}
          </button>
        </div>
      </div>
    );
  }

  // ── Playing screen ────────────────────────────────────────────────────────
  const isCorrect = selected === currentQ.correctIndex;
  const progressPct = ((currentIdx) / totalQ) * 100;
  const timeWarning = quiz.timeLimitSecs && timeLeft <= 30;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="h-2 rounded-full" style={{ background: "var(--cream-2)" }}>
            <div className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, background: "var(--vermilion)" }} />
          </div>
        </div>
        <span className="text-caption font-mono shrink-0" style={{ color: "var(--ink-3)" }}>
          {currentIdx + 1} / {totalQ}
        </span>
        {quiz.timeLimitSecs ? (
          <span className="font-mono text-sm font-medium shrink-0 px-2.5 py-1 rounded-lg"
            style={{
              background: timeWarning ? "var(--vermilion-soft)" : "var(--cream-2)",
              color: timeWarning ? "var(--vermilion)" : "var(--ink)",
            }}>
            {formatTime(timeLeft)}
          </span>
        ) : null}
      </div>

      {/* Question */}
      <div className="rounded-2xl border p-8 mb-6"
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
        <p className="text-caption mb-4" style={{ color: "var(--ink-3)" }}>
          คำถามที่ {currentIdx + 1}
        </p>
        <h3 className="text-h2 mb-6" style={{ color: "var(--ink)" }}>
          {currentQ.content}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            let borderColor = "var(--line)";
            let bg = "var(--paper)";
            let textColor = "var(--ink)";

            if (showAnswer) {
              if (optIdx === currentQ.correctIndex) {
                borderColor = "var(--pine)"; bg = "var(--pine-soft, #E8F5E9)"; textColor = "var(--pine)";
              } else if (optIdx === selected && !isCorrect) {
                borderColor = "var(--vermilion)"; bg = "var(--vermilion-soft)"; textColor = "var(--vermilion)";
              }
            } else if (selected === optIdx) {
              borderColor = "var(--vermilion)"; bg = "var(--vermilion-soft)"; textColor = "var(--ink)";
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                disabled={showAnswer}
                className="w-full text-left rounded-xl border px-5 py-3.5 transition-all flex items-center gap-3"
                style={{ borderColor, background: bg, color: textColor, cursor: showAnswer ? "default" : "pointer" }}
              >
                <span className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium shrink-0"
                  style={{ borderColor, color: textColor }}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="text-body-s">{option}</span>
                {showAnswer && optIdx === currentQ.correctIndex && (
                  <svg className="w-5 h-5 ml-auto shrink-0" viewBox="0 0 20 20" fill="var(--pine)">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback + Next */}
      {showAnswer && (
        <div className="flex items-center justify-between">
          <p className="text-body-s font-medium" style={{ color: isCorrect ? "var(--pine)" : "var(--vermilion)" }}>
            {isCorrect ? "ถูกต้อง!" : `ผิด — คำตอบที่ถูกคือ: ${currentQ.options[currentQ.correctIndex]}`}
          </p>
          <button className="plearn-btn plearn-btn-primary" onClick={handleNext}>
            {currentIdx + 1 >= totalQ ? "ดูผลลัพธ์" : "ถัดไป →"}
          </button>
        </div>
      )}

      {!showAnswer && !selected && selected !== 0 && (
        <p className="text-caption text-center" style={{ color: "var(--ink-4)" }}>
          กรุณาเลือกคำตอบ
        </p>
      )}
    </div>
  );
}
