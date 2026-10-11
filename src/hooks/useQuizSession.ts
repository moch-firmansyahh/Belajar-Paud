"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/constants";
import {
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
} from "@/lib/storage";
import { QuizSession, HasilQuiz } from "@/types";

export function useQuizSession() {
  const [session, setSessionState] = useState<QuizSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getSessionStorageItem<QuizSession | null>(
      STORAGE_KEYS.SESI_QUIZ,
      null
    );
    setSessionState(saved);
    setIsLoaded(true);
  }, []);

  const saveSession = useCallback((newSession: QuizSession | null) => {
    setSessionState(newSession);
    if (newSession) {
      setSessionStorageItem(STORAGE_KEYS.SESI_QUIZ, newSession);
    } else {
      removeSessionStorageItem(STORAGE_KEYS.SESI_QUIZ);
    }
  }, []);

  const updateJawabanPg = useCallback(
    (questionId: string, optionIndex: number) => {
      setSessionState((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          jawabanPg: {
            ...prev.jawabanPg,
            [questionId]: optionIndex,
          },
        };
        setSessionStorageItem(STORAGE_KEYS.SESI_QUIZ, updated);
        return updated;
      });
    },
    []
  );

  const updateJawabanEssay = useCallback(
    (questionId: string, text: string) => {
      setSessionState((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          jawabanEssay: {
            ...prev.jawabanEssay,
            [questionId]: text,
          },
        };
        setSessionStorageItem(STORAGE_KEYS.SESI_QUIZ, updated);
        return updated;
      });
    },
    []
  );

  const setHasil = useCallback((hasil: HasilQuiz) => {
    setSessionState((prev) => {
      if (!prev) return prev;
      const updated: QuizSession = {
        ...prev,
        selesai: true,
        hasil,
      };
      setSessionStorageItem(STORAGE_KEYS.SESI_QUIZ, updated);
      return updated;
    });
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    removeSessionStorageItem(STORAGE_KEYS.SESI_QUIZ);
  }, []);

  return {
    session,
    isLoaded,
    saveSession,
    updateJawabanPg,
    updateJawabanEssay,
    setHasil,
    clearSession,
  };
}
