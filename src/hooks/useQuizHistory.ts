"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS, MAX_HISTORIES, MAX_OLD_STEMS } from "@/constants";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from "@/lib/storage";
import {
  isSupabaseConfigured,
  saveQuizToSupabase,
  fetchQuizFromSupabase,
  clearQuizInSupabase,
} from "@/lib/supabase/db";
import { RiwayatQuizItem } from "@/types";

export function useQuizHistory() {
  const [history, setHistory] = useState<RiwayatQuizItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Muat dari localStorage seketika
    const localSaved = getLocalStorageItem<RiwayatQuizItem[]>(
      STORAGE_KEYS.RIWAYAT,
      []
    );
    setHistory(localSaved);
    setIsLoaded(true);

    // 2. Jika Supabase dikonfigurasi, sinkronkan data cloud
    if (isSupabaseConfigured) {
      fetchQuizFromSupabase().then((cloudData) => {
        if (cloudData && cloudData.length > 0) {
          setHistory(cloudData);
          setLocalStorageItem(STORAGE_KEYS.RIWAYAT, cloudData);
        }
      });
    }
  }, []);

  const getSoalLamaStems = useCallback((): string[] => {
    return getLocalStorageItem<string[]>(STORAGE_KEYS.SOAL_LAMA, []);
  }, []);

  const addQuizResult = useCallback(
    (item: RiwayatQuizItem, newStems: string[], detailHasil?: unknown) => {
      // 1. Simpan riwayat ke state & localStorage lokal
      setHistory((prev) => {
        const nextList = [item, ...prev].slice(0, MAX_HISTORIES);
        setLocalStorageItem(STORAGE_KEYS.RIWAYAT, nextList);
        return nextList;
      });

      // 2. Simpan pokok soal lama untuk mencegah duplikasi (maksimal 30 item)
      if (newStems.length > 0) {
        const existingStems = getLocalStorageItem<string[]>(
          STORAGE_KEYS.SOAL_LAMA,
          []
        );
        const combined = Array.from(new Set([...newStems, ...existingStems])).slice(
          0,
          MAX_OLD_STEMS
        );
        setLocalStorageItem(STORAGE_KEYS.SOAL_LAMA, combined);
      }

      // 3. Simpan ke database Supabase jika aktif
      if (isSupabaseConfigured) {
        saveQuizToSupabase(item, detailHasil);
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeLocalStorageItem(STORAGE_KEYS.RIWAYAT);
    if (isSupabaseConfigured) {
      clearQuizInSupabase();
    }
  }, []);

  return {
    history,
    isLoaded,
    isCloudSynced: isSupabaseConfigured,
    getSoalLamaStems,
    addQuizResult,
    clearHistory,
  };
}
