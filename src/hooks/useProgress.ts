"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/constants";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { ProgressMateri } from "@/types";

export type StatusMateri = "Belum dibaca" | "Sedang dibaca" | "Selesai";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMateri>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getLocalStorageItem<ProgressMateri>(STORAGE_KEYS.PROGRESS, {});
    setProgress(saved);
    setIsLoaded(true);
  }, []);

  const togglePaham = useCallback(
    (slug: string, kartuId: string) => {
      setProgress((prev) => {
        const currentList = prev[slug] || [];
        const exists = currentList.includes(kartuId);
        const updatedList = exists
          ? currentList.filter((id) => id !== kartuId)
          : [...currentList, kartuId];

        const nextState = {
          ...prev,
          [slug]: updatedList,
        };

        setLocalStorageItem(STORAGE_KEYS.PROGRESS, nextState);
        return nextState;
      });
    },
    []
  );

  const isPaham = useCallback(
    (slug: string, kartuId: string): boolean => {
      if (!progress[slug]) return false;
      return progress[slug].includes(kartuId);
    },
    [progress]
  );

  const getProgress = useCallback(
    (
      slug: string,
      totalKartu: number
    ): { completed: number; percent: number; status: StatusMateri } => {
      const list = progress[slug] || [];
      const completed = list.length;
      if (totalKartu <= 0 || completed === 0) {
        return { completed: 0, percent: 0, status: "Belum dibaca" };
      }

      const percent = Math.min(100, Math.round((completed / totalKartu) * 100));
      let status: StatusMateri = "Sedang dibaca";
      if (completed >= totalKartu) {
        status = "Selesai";
      }

      return { completed, percent, status };
    },
    [progress]
  );

  return {
    progress,
    isLoaded,
    togglePaham,
    isPaham,
    getProgress,
  };
}
