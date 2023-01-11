;(function(tools) {
  const container = document.getElementById('fifteen')
  const nodes = Array.from(container.querySelectorAll('.item'))
  const shuffle = document.getElementById('shuffle')
  const countItems = 16

  const matrix = tools.getMatrix(nodes.map(item => Number(item.dataset.matrixId)))

  shuffle.addEventListener('click', tools.giveShuffledArray.bind(tools, matrix, nodes))
  container.addEventListener('click', tools.changePositionTiles.bind(tools))

  tools.setPositionMatrix(matrix, nodes)

  nodes[countItems - 1].style.display = 'none'
})(new class {
  constructor(shift = 100)
  {
    this.shift = shift
  }

  getMatrix(arr)
  {
    const mx = [[], [], [], []]

    let x = 0
    let y = 0

    for (let i = 0; i < arr.length; i++) {
      if (x >= 4) {
        x = 0
        y++
      }

      mx[y][x] = arr[i]
      x++
    }

    return mx
  }

  setPositionMatrix(matrix, nodes)
  {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const value = matrix[y][x]
        const node = nodes[value - 1]

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
        this.getMatrix(shuffledArray),
        nodes
    )
  }

  makeShuffledArray(arr)
  {
    return arr
        .map(value => ({ value, k: Math.random() }))
        .sort((a, b) => a.k - b.k)
        .map(({ value }) => value)
  }

  changePositionTiles({ target })
  {
    const btn = target.closest('button')

    if (!btn) return

    console.log(btn)
  }
})
