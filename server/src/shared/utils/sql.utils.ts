export function escapeSqlLike(input: string) {
  // Replaces backslashes first, then escapes % and _ with a backslash
  return input
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}
