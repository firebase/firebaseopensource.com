import { formatDistanceToNow } from 'date-fns'

function isLetter (c: string) {
  return c.toLowerCase() !== c.toUpperCase()
}

function isCapital (c: string) {
  return c === c.toUpperCase()
}

function splitWords (name: string) {
  const words = []
  let currWord = ''

  for (let i = 0; i < name.length; i++) {
    const c = name[i]
    const prev = i === 0 ? '' : name[i - 1]
    const next = i === name.length - 1 ? '' : name[i + 1]

    // Word breaks are:
    //  * Non letter characters
    //  * Changes in case after the second letter
    const wordStart =
      isLetter(prev) &&
      isLetter(c) &&
      isCapital(c) &&
      !isCapital(next) &&
      i !== 1

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

export function daysAgo (date: Date) {
  return formatDistanceToNow(date) + ' ago'
}
