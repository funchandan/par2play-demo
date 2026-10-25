/**
 * TODO(schedule): No confirmed group-lesson timetable is in the repo.
 * These rows are placeholders. Replace them with real day, time, and spots.
 */

export type GroupLesson = {
  id: string;
  day: string;
  time: string;
  spotsLeft: string;
  /** True while the row is not a confirmed session. */
  placeholder: boolean;
};

export const GROUP_LESSONS: GroupLesson[] = [
  { id: "todo-1", day: "TODO", time: "TODO", spotsLeft: "TODO", placeholder: true },
  { id: "todo-2", day: "TODO", time: "TODO", spotsLeft: "TODO", placeholder: true },
  { id: "todo-3", day: "TODO", time: "TODO", spotsLeft: "TODO", placeholder: true },
];
