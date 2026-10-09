"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  HABIT_COLORS,
  HABIT_COLOR_KEYS,
  ICON_CHOICES,
} from "@/lib/habit-utils"
import type { Habit, HabitColor, HabitFrequency, HabitInput } from "@/types/habit"
import { cn } from "@/lib/utils"

interface HabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit: Habit | null
  submitting: boolean
  onSubmit: (input: HabitInput) => void
}

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Specific days / week" },
]

/**
 * The form lives inside Radix's DialogContent, which unmounts when closed.
 * Mounting fresh on every open gives us clean initial state from `habit`
 * without needing a state-resetting effect.
 */
function HabitFormFields({
  habit,
  submitting,
  onSubmit,
  onCancel,
}: {
  habit: Habit | null
  submitting: boolean
  onSubmit: (input: HabitInput) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(habit?.name ?? "")
  const [description, setDescription] = useState(habit?.description ?? "")
  const [icon, setIcon] = useState<string>(habit?.icon ?? ICON_CHOICES[0])
  const [color, setColor] = useState<HabitColor>(habit?.color ?? "emerald")
  const [frequency, setFrequency] = useState<HabitFrequency>(
    habit?.frequency ?? "daily"
  )
  const [targetDays, setTargetDays] = useState(
    habit?.frequency === "weekly" ? habit.targetDays : 5
  )
  const [touched, setTouched] = useState(false)

  const nameInvalid = touched && name.trim().length === 0
  const colorDef = HABIT_COLORS[color]

  const handleSubmit = () => {
    setTouched(true)
    if (!name.trim() || submitting) return
    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      icon,
      color,
      frequency,
      targetDays: frequency === "weekly" ? targetDays : 7,
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="habit-name">Name</Label>
        <Input
          id="habit-name"
          placeholder="e.g. Morning workout"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={nameInvalid}
          className={cn(nameInvalid && "border-destructive focus-visible:ring-destructive")}
        />
        {nameInvalid && (
          <p className="text-xs text-destructive">Give your habit a name.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="habit-description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="habit-description"
          placeholder="Why does this matter to you?"
          value={description}
          maxLength={200}
          rows={2}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-8 gap-1.5" role="radiogroup" aria-label="Choose an icon">
          {ICON_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              role="radio"
              aria-checked={icon === choice}
              aria-label={`Icon ${choice}`}
              onClick={() => setIcon(choice)}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg border text-lg transition-colors hover:bg-accent",
                icon === choice &&
                  "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
              )}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2.5" role="radiogroup" aria-label="Choose a color">
          {HABIT_COLOR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={color === key}
              aria-label={`Color ${HABIT_COLORS[key].label}`}
              onClick={() => setColor(key)}
              className={cn(
                "h-8 w-8 rounded-full transition-transform hover:scale-110",
                HABIT_COLORS[key].solid,
                color === key &&
                  "ring-2 ring-foreground/40 ring-offset-2 ring-offset-background"
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choose frequency">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={frequency === f.value}
              onClick={() => setFrequency(f.value)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                frequency === f.value &&
                  "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {frequency === "weekly" && (
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="habit-target">Target</Label>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {targetDays}&times; per week
              </span>
            </div>
            <Slider
              id="habit-target"
              min={1}
              max={7}
              step={1}
              value={[targetDays]}
              onValueChange={(v) => setTargetDays(v[0])}
              className="mt-2 [&_[role=slider]]:bg-emerald-600"
              aria-label="Days per week target"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-muted/40 p-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl",
              colorDef.chip
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {name.trim() || "Habit name"}
            </p>
            <p className="text-xs text-muted-foreground">
              {frequency === "daily" ? "Every day" : `${targetDays}\u00D7 per week`}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !name.trim()}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {habit ? "Save changes" : "Create habit"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function HabitDialog({
  open,
  onOpenChange,
  habit,
  submitting,
  onSubmit,
}: HabitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{habit ? "Edit habit" : "New habit"}</DialogTitle>
          <DialogDescription>
            {habit
              ? "Adjust the details of your habit."
              : "Small, specific and repeatable beats ambitious and vague."}
          </DialogDescription>
        </DialogHeader>
        <HabitFormFields
          habit={habit}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
