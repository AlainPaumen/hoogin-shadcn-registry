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
