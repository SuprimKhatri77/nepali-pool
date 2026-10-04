// Drizzle relation config that loads one side of a chat or video call with
// only the fields the other side may see (name and photo).
export const participantColumns = {
  columns: { userId: true, imageUrl: true },
  with: { user: { columns: { id: true, name: true, image: true } } },
} as const;
