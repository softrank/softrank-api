export const stringDate = (): string => {
  const [date] = new Date().toISOString().split('T')
  return date
}
