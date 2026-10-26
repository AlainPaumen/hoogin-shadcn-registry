// Chrome/Chromium paint autofill with background-color !important (it cannot
// be overridden) — cover it with an opaque inset box-shadow and freeze the
// background change with a huge transition. This is the only known override.
export const inputAutofillClasses =
  "[&:-webkit-autofill]:[box-shadow:inset_0_0_0_1000px_var(--background)] " +
  "dark:[&:autofill]:[box-shadow:inset_0_0_0_1000px_var(--card)] " +
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]! " +
  "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out]"

export function fieldErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.map(fieldErrorMessage).join(", ")
  }
  return "Invalid value"
}

export function isRequiredField(schema: { isOptional: () => boolean }): boolean {
  return !schema.isOptional()
}

export function isFieldLevelErrorMap(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  if (Array.isArray(error) || "message" in error) return false
  const values = Object.values(error)
  if (values.length === 0) return false
  return values.every((value) => Array.isArray(value) && value.length > 0)
}
