export const makeFakeCnpj = (mask = false): string => {
  let numbers = makeRandom(12)
  numbers = `${numbers}${digitCnpj(numbers)}`
  numbers = `${numbers}${digitCnpj(numbers)}`
  return mask ? formatCnpj(numbers) : numbers
}

export const makeFakeCpf = (mask = false): string => {
  let numbers = makeRandom(9)
  numbers = `${numbers}${digitCpf(numbers)}`
  numbers = `${numbers}${digitCpf(numbers)}`
  return mask ? formatCpf(numbers) : numbers
}

const mod = (dividendo: number, divisor: number): number => {
  return Math.round(dividendo - Math.floor(dividendo / divisor) * divisor)
}

const makeRandom = (size = 9): string => {
  const array = createArray(size, 9)
  return `${array.join('')}`
}

const createArray = (total: number, numero: number): number[] => Array.from(Array(total), () => numberRandom(numero))
const numberRandom = (number: number): number => Math.round(Math.random() * number)

const digitCnpj = (numbers: string): number => {
  const reverse = numbers
    .split('')
    .map((value) => parseInt(value))
    .reverse()
  let index = 2
  const sum = reverse.reduce((buffer, number) => {
    buffer += number * index
    index = index === 9 ? 2 : index + 1
    return buffer
  }, 0)
  const d1 = 11 - mod(sum, 11)
  return d1 >= 10 ? 0 : d1
}
const formatCnpj = (cnpj: string): string => cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')

const digitCpf = (numbers: string): number => {
  const sum = numbers
    .split('')
    .map((digit) => parseInt(digit))
    .reverse()
    .reduce((acc, a, b) => acc + a * (b + 2), 0)
  const d1 = 11 - mod(sum, 11)
  return d1 > 9 ? 0 : d1
}
const formatCpf = (cpf: string): string => cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
