;(function(M) {
  const page = document.querySelector('.page')
  const container = document.querySelector('.fifteen')
  const nodes = Array.from(container.querySelectorAll('.item'))
  const shuffle = document.querySelector('.shuffle')

  const countTiles = 16
  const shift = 100

  let win = Array.from(Array(countTiles), (_, i) => i + 1),
      matrix = M.getMatrix(nodes.map(item => Number(item.dataset.matrixId))),
      blankTile = countTiles,
      countShuffle = 150,
      timer = null,
      block = null,
      btn

  function setPosition(init)
  {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        nodes[matrix[y][x] - 1].style.transform = `translate(${x * shift}%, ${y * shift}%)`
      }
    }

    if (!init && !timer && isWin()) {
      setTimeout(() => {
        container.classList.add('fifteenWin')

        setTimeout(() => {
          container.classList.remove('fifteenWin')
        }, 1500)

      }, 200)
    }
  }

  function isWin()
  {
    const currentMatrix = matrix.flat()

    for (let i = 0; i < win.length; i++) {
      if (currentMatrix[i] !== win[i]) {
        return false
      }
    }

    return true
  }

  nodes[countTiles - 1].style.display = 'none'

  container.addEventListener('click', ({ target }) => {
    if (timer || !(btn = target.closest('button'))) return

    matrix = M.changePositionByClick(Number(btn.dataset.matrixId), matrix, blankTile)

    setPosition()
  })

  shuffle.addEventListener('click', () => {
    if (timer) return

    page.classList.add('shuffling')
    timer = setInterval(() => {
      if (countShuffle <= 0) {
        page.classList.remove('shuffling')
        clearInterval(timer)
        countShuffle = 150
        timer = null
      }

      ({ matrix, block } = M.randomSwap(matrix, blankTile, block))
      setPosition()

      countShuffle--

    }, 70)
  })

  window.addEventListener('keydown', ({ key }) => {
    if (timer || !key.toLowerCase().includes('arrow')) return

    const direction = key.split('Arrow')[1].toLowerCase()

    matrix = M.changePositionByKeydown(direction, matrix, blankTile)

    setPosition()
  })

  setPosition(true)

})(new class /* Matrix */ {
  getMatrix(arr)
  {
    const matrix = [[], [], [], []]

    let x, y, i

    for (x = y = i = 0; i < arr.length; i++) {
      if (x >= 4) {
        x = 0
        y++
      }

      matrix[y][x] = arr[i]
      x++
    }

    return matrix
  }

  changePositionByClick(number, matrix, blank)
  {
    const coords1 = this.findCoordsByNumber(number, matrix)
    const coords2 = this.findCoordsByNumber(blank, matrix)

    return this.isValidForSwap(coords1, coords2)
        ? this.swapTiles(coords1, coords2, matrix)
        : matrix
  }

  changePositionByKeydown(direction, matrix, blank)
  {
    const coords2 = this.findCoordsByNumber(blank, matrix)
    const coords1 = { x: coords2.x, y: coords2.y }

    const maxIdx = matrix.length

    switch (direction) {
      case 'up':
        coords1.y += 1
        break
      case 'down':
        coords1.y -= 1
        break
      case 'left':
        coords1.x += 1
        break
      case 'right':
        coords1.x -= 1
        break
    }

    return coords1.y < maxIdx && coords1.x < maxIdx && coords1.y >= 0 && coords1.x >= 0
        ? this.swapTiles(coords1, coords2, matrix)
        : matrix
  }

  findCoordsByNumber(number, matrix)
  {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === number) {
          return { x, y }
        }
      }
    }

    return null
  }

  findValidCoords(coords, blocked, matrix)
  {
    const validCoords = []

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (blocked && blocked.x === x && blocked.y === y) continue

        if (this.isValidForSwap({ x, y }, coords)) {
          validCoords.push({ x, y })
        }
      }
    }

    return validCoords[Math.random() * validCoords.length | 0]
  }

  isValidForSwap(coords1, coords2)
  {
    if (coords1?.x !== coords2?.x && coords1?.y !== coords2?.y) return false

    const diffX = Math.abs(coords1.x - coords2.x)
    const diffY = Math.abs(coords1.y - coords2.y)

    return (diffX === 1 || diffY === 1)
  }

  swapTiles(coords1, coords2, matrix)
  {
    const tmp = matrix[coords1.y][coords1.x]

    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
    matrix[coords2.y][coords2.x] = tmp

    return matrix
  }

  randomSwap(matrix, blank, block)
  {
    const coords2 = this.findCoordsByNumber(blank, matrix)
    const coords1 = this.findValidCoords(coords2, block, matrix)

    return {
      matrix: this.swapTiles(coords1, coords2, matrix),
      block: coords2
    }
  }
})
