const containerNode = document.getElementById('fifteen')
const itemNodes = Array.from(containerNode.querySelectorAll('.item'))
const countItems = 16
const shift = 100

const matrix = getMatrix(itemNodes.map(item => Number(item.dataset.matrixId)))

setPositionMatrix(matrix)

itemNodes[countItems - 1].style.display = 'none'

function getMatrix(arr)
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

function setPositionMatrix(matrix)
{
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x]
      const node = itemNodes[value - 1]

      setNodeStyle(node, x, y)
    }
  }
}

function setNodeStyle(node, x, y)
{
  node.style.transform = `translate3D(${x * shift}%, ${y * shift}%, 0)`
}
