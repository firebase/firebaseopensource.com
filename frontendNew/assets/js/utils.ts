import { formatDistanceToNow } from 'date-fns'
import { Timestamp } from '../../../shared/types'

const COLORS = [
  '#039BE5',
  '#673AB7',
  '#FBC02D',
  '#FF7043',
  '#C2185B',
  '#009688',
  '#9C27B0',
  '#33AC71'
]

function isLetter (c: string) {
  return c.toLowerCase() != c.toUpperCase()
}

function isCapital (c: string) {
  return c == c.toUpperCase()
}

function splitWords (name: string) {
  const words = []
  let currWord = ''

  for (let i = 0; i < name.length; i++) {
    const c = name[i]
    const prev = i == 0 ? '' : name[i - 1]
    const next = i == name.length - 1 ? '' : name[i + 1]

    // Word breaks are:
    //  * Non letter characters
    //  * Changes in case after the second letter
    const wordStart =
      isLetter(prev) &&
      isLetter(c) &&
      isCapital(c) &&
      !isCapital(next) &&
      i != 1

    const exclude = !isLetter(c)
    const wordBreak = !isLetter(c) || wordStart

    if (wordBreak && i > 0) {
      words.push(currWord)
      currWord = ''
    }

    if (!exclude) {
      currWord += c
    }
  }

  words.push(currWord)

  return words
}

export function pickLogoLetter (name: string) {
  const fire = /[Ff]ire(base)?(-)?/
  const nameClean = name.replace(fire, '')
  const words = splitWords(nameClean)
  const firstLetter = words[0][0].toUpperCase()

  return firstLetter
}

export function daysAgo (t: Timestamp) {
  return formatDistanceToNow(new Date(t.seconds * 1000)) + ' ago'
}

export function pickLogoColor (docIndex: number, categoryIndex: number) {
  return COLORS[(docIndex + categoryIndex) % COLORS.length]
}
