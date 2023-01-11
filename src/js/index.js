;(function(tools) {
  const container = document.getElementById('fifteen')
  const nodes = Array.from(container.querySelectorAll('.item'))
  const shuffle = document.getElementById('shuffle')
  const countTiles = 16

  let matrix = tools.getMatrix(nodes.map(item => Number(item.dataset.matrixId)))

  container.addEventListener('click', e => {
    tools.changePositionByClick(matrix, e)
  })
  shuffle.addEventListener('click', () => {
    matrix = tools.giveShuffledArray(matrix, nodes)
  })

  tools.setPositionMatrix(matrix, nodes)

  nodes[countTiles - 1].style.display = 'none'
})(new class {
  constructor(shift = 100, blankTile = 16)
  {
    this.shift = shift
    this.blankTile = blankTile
  }

  getMatrix(arr)
  {
    const matrix = [[], [], [], []]

    let x = 0
    let y = 0

    for (let i = 0; i < arr.length; i++) {
      if (x >= 4) {
        x = 0
        y++
      }

      matrix[y][x] = arr[i]
      x++
    }

    return matrix
  }

  setPositionMatrix(matrix, nodes)
  {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const node = nodes[matrix[y][x] - 1]

        this.setNodeStyle(node, x, y)
      }
    }
  }

  setNodeStyle(node, x, y)
  {
    node.style.transform = `translate(${x * this.shift}%, ${y * this.shift}%)`
  }

  giveShuffledArray(matrix, nodes)
  {
    const shuffledArray = this.makeShuffledArray(matrix.flat())

    this.setPositionMatrix(
        matrix = this.getMatrix(shuffledArray),
        nodes
    )

    return matrix
  }

  makeShuffledArray(arr)
  {
    return arr
        .map(value => ({ value, k: Math.random() }))
        .sort((a, b) => a.k - b.k)
        .map(({ value }) => value)
  }

  changePositionByClick(matrix, { target })
  {
    const btn = target.closest('button')

    if (!btn) return

    const btnNumber = Number(btn.dataset.matrixId)
    const isValid = this.isValidForSwap(
        this.findCoordsByNumber(btnNumber, matrix),
        this.findCoordsByNumber(matrix)
    )

    console.log({ btnNumber, isValid })
  }

  findCoordsByNumber(number, matrix)
  {
    if (Array.isArray(number) && !matrix) {
      matrix = number
      number = this.blankTile
    }

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === number) {
          return { x, y }
        }
      }
    }

    return null
  }

  isValidForSwap(coords1, coords2)
  {
    if (coords1.x !== coords2.x && coords1.y !== coords2.y) return false

    const diffX = Math.abs(coords1.x - coords2.x)
    const diffY = Math.abs(coords1.y - coords2.y)

    return (diffX === 1 || diffY === 1)
  }
})
