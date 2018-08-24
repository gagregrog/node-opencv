const shuffleArray = arr => {
  const copy = arr.slice()
  const shuffled = []

  while(copy.length) {
    const index = Math.floor(Math.random() * copy.length)
    shuffled.push(copy[index])
    copy.splice(index, 1)
  }

  return shuffled
}

const splitAtPercent = (arr, percent=0.75) => {
  const split = parseInt(arr.length * percent)
  const first = arr.slice(0, split)
  const second = arr.slice(split)

  return [first, second]
}

module.exports = {
  shuffleArray,
  splitAtPercent,
}
