export function CleanNonNumbers(value: string): string {
  const regex = new RegExp(/\D/, 'g')
  return value?.replace(regex, '')
}
