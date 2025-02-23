// hooks/use-notifications.ts
"use client";

import useSWR from "swr";
import { Notification } from "@/types/notification";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export function useNotifications() {
  const { data, error, mutate } = useSWR<Notification[]>(
    "/api/notifications",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    notifications: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}
