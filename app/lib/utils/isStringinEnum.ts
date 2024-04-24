export function isStringInEnum<T extends Record<string, string>>(value: string, enumObject: T): value is Extract<keyof T, string> {
  return Object.values(enumObject).includes(value);
}