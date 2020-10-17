//ta tudo encapsulado na funcao init so para eu gerar os relatorios
// size = qtd de rainhas e tamanho do tabuleiro size*size

function init(size) {
  let begin = Date.now()
  let mngMatrix = manageMatrix()
  let matrix = mngMatrix.createMatrix(size)
  let fnlQueens = start()

  let end = Date.now()
  let endTime = end - begin

  let used = process.memoryUsage().heapUsed / 1024 / 1024
  let memoryUsed = Math.round(used * 100) / 100

  // console.log('[!] Quantidade de rainhas -> ', size)
  // console.log(`[!] Tempo ${endTime}ms\n `)
  // console.log(`[!] Uso de memória ${memoryUsed}mb\n `)
  // console.log(`[!] finalizado, total de movimentos -> ${mngMatrix.countMove}`)

  verifyConclusion(fnlQueens)
  // mngMatrix.showMatrixwithQueens(fnlQueens)

  return [size, endTime, memoryUsed, mngMatrix.countMove]

  function manageMatrix() {
    let countMove = 0
    function createMatrix(size) {
      let matrix = []
      for (let i = 0; i < size; i++) {
        matrix[i] = []
        for (let j = 0; j < size; j++) {
          matrix[i][j] = { queen: false, color: null }
        }
      }
      return matrix
    }

    function move(line, column, dLine, dColumn) {
      matrix[dLine][dColumn] = matrix[line][column]
      matrix[line][column] = { queen: false, color: null }
      this.countMove++
    }

    function setQueensInMatrix(queens) {
      queens.map(({ line, column }) => {
        matrix[line][column].queen = true
      })
    }

    function showMatrixwithQueens(queens) {
      for (let i = 0; i < size; i++) {
        let str = ''
        for (let j = 0; j < size; j++) {
          str += `${matrix[i][j].queen ? 'x ' : 'o '}`
        }
        console.log(str)
      }
    }

    return {
      createMatrix,
      move,
      setQueensInMatrix,
      showMatrixwithQueens,
      countMove
    }
  }

  function verifyConclusion(queens) {
    count = 0
    queens.map(queen => {
      const { flag } = searchQueensAndCalcWeight().getWeightsPerPosition(
        queen.line,
        queen.column,
        0
      )
      if (!flag) {
        count++
      }
    })

    if (count === size) {
      console.log('[✅] Solucionado')
      return
    }
    console.log('[X] Não solucionado')
  }

  function start() {
    let queens = searchQueensAndCalcWeight().genQueensInRandomPositions()
    // let queens = searchQueensAndCalcWeight().genQueens()

    mngMatrix.setQueensInMatrix(queens)

    let count = 0
    while (count < size) {
      count = 0
      queens.map(queen => {
        const { flag, line, column } = searchQueensAndCalcWeight().start(
          queen.line,
          queen.column
        )

        if (flag) {
          queen.line = line
          queen.column = column
        } else {
          count++
        }
      })
    }
    return queens
  }

  function searchQueensAndCalcWeight() {
    function start(line, column) {
      const { flag, line: dLine, column: dColumn } = getWeightsPerPosition(
        line,
        column
      )

      if (flag) {
        mngMatrix.move(line, column, dLine, dColumn)
        return { flag: true, line: dLine, column: dColumn }
      }
      return { flag: false, line, column }
    }

    function genQueens() {
      let queens = []
      for (let j = 0; j < size; j++) {
        matrix[0][j].queen = true
        queens.push({ line: 0, column: j })
      }
      return queens
    }

    function genQueensInRandomPositions() {
      let queens = []

      while (queens.length < size) {
        let line = Math.floor(Math.random() * size)
        let column = Math.floor(Math.random() * size)

        let equalPosition = queens.find(
          queen => queen.line === line && queen.column === column
        )

        if (!equalPosition) {
          queens.push({ line, column })
        }
      }
      return queens
    }

    function getWeightsPerPosition(line, column) {
      const result = []

      result.push(searchTop(line, column))
      result.push(searchRight(line, column))
      result.push(searchBottom(line, column))
      result.push(searchLeft(line, column))

      result.push(searchRightToBottom(line, column))
      result.push(searchRightToTop(line, column))
      result.push(searchLeftToBottom(line, column))
      result.push(searchLeftoToTop(line, column))

      let count = 0

      result.map(element => {
        //se nao for rainhas ele conta
        if (!element.flag) {
          count++
        }
      })

      if (count === result.length) {
        //nao se mexe, nao tem nenhuma rainha mirando nele
        return { flag: false }
      }
      let AllPoints = []
      result.map(element => {
        element.position.map(point => {
          let countQueen = 0
          if (searchTop(point.line, point.column).flag) {
            countQueen++
          }
          if (searchRight(point.line, point.column).flag) {
            countQueen++
          }
          if (searchBottom(point.line, point.column).flag) {
            countQueen++
          }
          if (searchLeft(point.line, point.column).flag) {
            countQueen++
          }
          if (searchRightToBottom(point.line, point.column).flag) {
            countQueen++
          }
          if (searchRightToTop(point.line, point.column).flag) {
            countQueen++
          }
          if (searchLeftToBottom(point.line, point.column).flag) {
            countQueen++
          }
          if (searchLeftoToTop(point.line, point.column).flag) {
            countQueen++
          }
          point.value = countQueen - 1 // -1 é para tirar a rainha que esta querendo andar
          AllPoints.push(point)
        })
      })

      //ordenar por menos rainhas no perimetro
      AllPoints.sort((a, b) => {
        return a.value - b.value
      })
      return { flag: true, ...AllPoints[0] } // melhor posicao naquele momento
    }

    function searchTop(line, column) {
      let flag = false
      const position = []

      for (let i = line; i >= 0; i--) {
        if (i !== line) {
          if (matrix[i][column].queen) {
            flag = true
            i = -1
          } else {
            position.push({ line: i, column })
          }
        }
      }
      return { flag, position }
    }

    function searchRight(line, column) {
      let flag = false
      const position = []

      for (let j = column; j < size; j++) {
        if (j !== column) {
          if (matrix[line][j].queen) {
            flag = true
            j = size
          } else {
            position.push({ line, column: j })
          }
        }
      }
      return { flag, position }
    }

    function searchBottom(line, column) {
      let flag = false
      const position = []

      for (let i = line; i < size; i++) {
        if (i !== line) {
          if (matrix[i][column].queen) {
            flag = true
            i = size
          } else {
            position.push({ line: i, column })
          }
        }
      }
      return { flag, position }
    }

    function searchLeft(line, column) {
      let flag = false
      const position = []

      for (let j = column; j >= 0; j--) {
        if (j !== column) {
          if (matrix[line][j].queen) {
            flag = true
            j = -1
          } else {
            position.push({ line, column: j })
          }
        }
      }
      return { flag, position }
    }

    //diagonal

    function searchRightToTop(line, column) {
      let flag = false
      let j = column
      const position = []

      for (let i = line; i >= 0; i--) {
        if (j < size) {
          if (i !== line && j !== column) {
            if (matrix[i][j].queen) {
              flag = true
              i = -1 //break loop
            } else {
              position.push({ line: i, column: j })
            }
          }

          j++
        }
      }

      return { flag, position }
    }

    function searchLeftoToTop(line, column) {
      let flag = false
      let j = column
      const position = []

      for (let i = line; i >= 0; i--) {
        if (j >= 0) {
          if (i !== line && j !== column) {
            if (matrix[i][j].queen) {
              flag = true
              i = -1 //break loop
            } else {
              position.push({ line: i, column: j })
            }
          }

          j--
        }
      }
      return { flag, position }
    }

    function searchRightToBottom(line, column) {
      let flag = false
      let j = column
      const position = []

      for (let i = line; i < size; i++) {
        if (j < size) {
          if (i !== line && j !== column) {
            if (matrix[i][j].queen) {
              flag = true
              i = size //break loop
            } else {
              position.push({ line: i, column: j })
            }
          }

          j++
        }
      }
      return { flag, position }
    }

    function searchLeftToBottom(line, column) {
      let flag = false
      let j = column
      const position = []

      for (let i = line; i < size; i++) {
        if (j >= 0) {
          if (i !== line && j !== column) {
            if (matrix[i][j].queen) {
              flag = true
              i = size //break loop
            } else {
              position.push({ line: i, column: j })
            }
          }

          j--
        }
      }
      return { flag, position }
    }

    return {
      start,
      genQueens,
      genQueensInRandomPositions,
      getWeightsPerPosition
    }
  }
}

// init(8)
module.exports = init
