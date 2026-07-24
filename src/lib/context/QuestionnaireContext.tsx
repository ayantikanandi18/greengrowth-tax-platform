"use client";

import { createContext, useContext, useState } from "react";

interface QuestionnaireContextValue {
  /** Answers submitted this session, keyed by question id. Local state only — resets on refresh, same as the rest of the app. */
  sessionAnswers: Record<string, string>;
  submitAnswer: (questionId: string, answer: string) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, string>>({});

  function submitAnswer(questionId: string, answer: string) {
    setSessionAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  return (
    <QuestionnaireContext.Provider value={{ sessionAnswers, submitAnswer }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaireProgress() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) throw new Error("useQuestionnaireProgress must be used within QuestionnaireProvider");
  return ctx;
}
