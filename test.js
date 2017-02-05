// Зависимости -----------------------------------------------------------------
const fs = require('fs')
const { prepareLinks, generateText } = require('./generator')

// Подгружаем файл
let input = fs.readFileSync('./input.txt', 'utf-8')

// Подготовка звеньев
let { links, startWords } = prepareLinks({ input })

// Генерация предложения
let randomSentence = generateText({ links, startWords, amount: 1 })

// Вывод сгенеррированного предложения на экран
console.log(randomSentence)
