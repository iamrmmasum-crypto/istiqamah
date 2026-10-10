"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Habit, HabitInput, ToggleResult } from "@/types/habit"

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Something went wrong")
  }
  return data as T
}

export function useHabits() {
  const queryClient = useQueryClient()
  const queryKey = ["habits"] as const

  const query = useQuery<Habit[]>({
    queryKey,
    queryFn: async () => {
      const data = await fetch("/api/habits").then((res) =>
        jsonOrThrow<{ habits: Habit[] }>(res)
      )
      return data.habits
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["habits"] })

  const createHabit = useMutation<Habit, Error, HabitInput>({
    mutationFn: async (input) => {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const data = await jsonOrThrow<{ habit: Habit }>(res)
      return data.habit
    },
    onSuccess: () => invalidate(),
  })

  const updateHabit = useMutation<Habit, Error, { id: string; input: Partial<HabitInput> }>({
    mutationFn: async ({ id, input }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const data = await jsonOrThrow<{ habit: Habit }>(res)
      return data.habit
    },
    onSuccess: () => invalidate(),
  })

  const deleteHabit = useMutation<{ ok: boolean }, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" })
      return jsonOrThrow<{ ok: boolean }>(res)
    },
    onSuccess: () => invalidate(),
  })

  const toggleHabit = useMutation<ToggleResult, Error, { habitId: string; date: string }>({
    mutationFn: async ({ habitId, date }) => {
      const res = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      })
      return jsonOrThrow<ToggleResult>(res)
    },
    onMutate: async ({ habitId, date }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Habit[]>(queryKey)
      queryClient.setQueryData<Habit[]>(queryKey, (old) =>
        old?.map((habit) => {
          if (habit.id !== habitId) return habit
          const has = habit.entries.some((e) => e.date === date && e.completed)
          const entries = has
            ? habit.entries.filter((e) => !(e.date === date && e.completed))
            : [
                ...habit.entries,
                {
                  id: `optimistic-${habitId}-${date}`,
                  habitId,
                  date,
                  completed: true,
                  createdAt: new Date().toISOString(),
                },
              ]
          return { ...habit, entries }
        })
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => invalidate(),
  })

  const seedDemo = useMutation<Habit[], Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/habits/demo", { method: "POST" })
      const data = await jsonOrThrow<{ habits: Habit[] }>(res)
      return data.habits
    },
    onSuccess: () => invalidate(),
  })

  return {
    habits: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    seedDemo,
  }
}
