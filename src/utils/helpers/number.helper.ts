export const cleanNonNumbers = (value: string): string => {
  const regex = new RegExp(/\D/, 'g')
  return value?.replace(regex, '')
}
