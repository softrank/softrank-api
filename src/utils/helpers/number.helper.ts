export const cleanNonNumbers = (value: string): string => {
  const regex = new RegExp(/\D/, 'i')
  return value?.replace(regex, '')
}
