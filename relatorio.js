// esse arquivo é responsavel por gerar relatórios

/*
  é feito 10 testes por grupo de rainhas(32,64,128)
  saindo:
    tempo de de execução
    memória
    e movimentos
    + variacao e desvio padrao
*/
const fs = require('fs')
const init = require('./index')

// const calcResult = []
function saveJSON(calcResult, size) {
  const save = {
    tempo: {
      media: calcResult[0],
      desvioPadrao: calcResult[1],
      variancia: calcResult[2]
    },
    memoria: {
      media: calcResult[3],
      desvioPadrao: calcResult[4],
      variancia: calcResult[5]
    },
    movimentos: {
      media: calcResult[6],
      desvioPadrao: calcResult[7],
      variancia: calcResult[8]
    }
  }

  fs.writeFile(
    `./${size}.json`,
    JSON.stringify(save, null, 2),
    'utf8',
    function (err) {
      if (err) {
        console.log('[x] Erro na hora de salvar o JSON')
      } else {
        console.log(`[!] ${size}.json salvo`)
      }
    }
  )
}

function saveCSV(calcResult, size) {
  let csv =
    'tempo médio em ms, desvio padrão do tempo, variação do tempo, média de memória, desvio padrão da memória, variação da memória, movimentos média, desvio padrão dos movimentos, variação dos movimentos\n'

  csv += calcResult.join(',')
  csv += '\n'
  fs.writeFile(`./${size}.csv`, csv, 'utf8', function (err) {
    if (err) {
      console.log('[x] Erro na hora de salvas o CSV')
    } else {
      console.log(`[!] ${size}.csv salvo`)
    }
  })
}

function desvioPadrao(arr, average) {
  let result = 0
  arr.map(value => {
    const cl = value - average
    result += Math.pow(cl, 2)
  })
  return Math.sqrt(result / arr.length).toFixed(2)
}

function variancia(arr, average) {
  let result = 0
  arr.map(value => {
    const cl = value - average
    result += Math.pow(cl, 2)
  })
  return (result / arr.length).toFixed(2)
}

function genRelatorio(content) {
  let times = []
  let memory = []
  let moves = []

  content.map(resultado => {
    times.push(resultado[1])
    memory.push(resultado[2])
    moves.push(resultado[3])
  })

  const averageTime = (
    times.reduce(function (a, b) {
      return a + b
    }, 0) / times.length
  ).toFixed(2)

  const averageMemory = (
    memory.reduce(function (a, b) {
      return a + b
    }, 0) / memory.length
  ).toFixed(2)

  const averageMoves = (
    moves.reduce(function (a, b) {
      return a + b
    }, 0) / moves.length
  ).toFixed(2)

  const desvTime = desvioPadrao(times, averageTime)
  const variaTime = variancia(times, averageTime)

  const desvMemory = desvioPadrao(memory, averageMemory)
  const variaMemory = variancia(memory, averageMemory)

  const desvMoves = desvioPadrao(moves, averageMoves)
  const variaMoves = variancia(moves, averageMoves)
  return [
    averageTime,
    desvTime,
    variaTime,
    averageMemory,
    desvMemory,
    variaMemory,
    averageMoves,
    desvMoves,
    variaMoves
  ]
}
let size = 32
for (let i = 0; i < 3; i++) {
  const test = []
  for (let j = 0; j < 10; j++) {
    test.push(init(size))
  }
  console.log(`[!] os 10 testes das ${size} rainhas terminou`)
  const result = genRelatorio(test)
  // saveCSV(result, size)
  saveJSON(result, size)
  size *= 2
}
