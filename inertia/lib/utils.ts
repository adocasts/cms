import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NumberLike } from '~/types/utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function secondsToTimestring(totalSeconds: NumberLike) {
  let numSeconds = toNumber(totalSeconds)

  const hours = Math.floor(numSeconds / 3600)

  numSeconds %= 3600

  const minutes = Math.floor(numSeconds / 60)

  return `${hours}h ${minutes}m`
}

export function toNumber(value: NumberLike) {
  return typeof value === 'number' ? value : Number(value)
}

export function toLocaleString(
  value: NumberLike,
  locales?: Intl.LocalesArgument,
  options?: Intl.NumberFormatOptions
) {
  return toNumber(value).toLocaleString(locales, options)
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(Number(k))) as K[]
}

export function createDebounce() {
  let timeout: NodeJS.Timeout | undefined
  return function (fnc: () => void, delayMs: number = 500) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fnc()
    }, delayMs || 500)
  }
}
