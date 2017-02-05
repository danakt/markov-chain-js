/**
 * @desc Генерация текста на основе Цепи Маркова
 * @author Danakt Frost <mail@danakt.ru>
 */

const fs = require('fs')

// Рантайм ---------------------------------------------------------------------
// Подгружаем файл
input = fs.readFileSync('./input.txt', 'utf-8')
// Подготовка звеньев
console.time('Подготовка исходных данных')
let { links, startWords } = prepareLinks({ input })
console.timeEnd('Подготовка исходных данных')

// Генерация текста
console.time('Генерация текста')
console.log(generateText({ links, startWords }))
console.timeEnd('Генерация текста')

// Подготовка звеньев ----------------------------------------------------------
function prepareLinks({ input }) {
    let links = Object
    let startWords = Array

    let words, set

    // Сперва создаём массив со стартовыыми словами
    startWords = input
        .match(/(^|[!?.]\s)([А-Я][а-я]+)(\s|$)/gm)
        .map(item => item.replace(/[^А-я]/g, ''))

    input = input
        // Заменяем все символы разделения слов на человеческие
        .replace(/[\t\n\v\f\r \xA10]/g, ' ')
        // Удаляем ненужные символы
        .replace(/[^A-zА-я0-9 -\!\?\.,:]/g, '')

    // Разбивка текста на массив
    words = input.split(/[\n\s\xA0]+/)

    // Заполняем звенья
    links = {}
    for (let word of new Set(words)) {
        if(word[word.length - 1] == null) {
            continue
        }
        // Это это последнее слово в предложении, идём дальше
        if(word[word.length - 1].indexOf(/[.!?]/) > -1) {
            continue
        }

        // Ищем слова, которые встречаются после текущего
        let index = words.indexOf(word)
        while(index > -1) {
            let nextWord = words[index + 1]
            if(nextWord == null) break

            // Добавляем ячейку
            links[word] != null
                ? links[word].add(nextWord)
                : links[word] = new Set([nextWord])

            // Делаем новый поиск
            index = words.indexOf(word, index + 1)
        }


        if(links[word] != null) {
            links[word] = Array.from(links[word])
        }

    }

    return { links, startWords }
}

// Функция генерациия текста ---------------------------------------------------
function generateText({ links, startWords }) {
    let sentence = startWords[getRandomInt({ max: startWords.length })]
    let lastWord = sentence

    for(let i = 0; !/[.!?]/.test(sentence[sentence.length - 1]); i++) {
        if(links[lastWord] == null) break

        let newWordIndex = getRandomInt({ max: links[lastWord].length })
        let newWord = links[lastWord][newWordIndex]

        lastWord = newWord
        sentence += ' ' + newWord

        if(i > 30) {
            // Если получилось много слов в предложении,
            // например начала повторяться какая-то фраза,
            // пробуем заново составить предложение
            return generateText({ links, startWords })
        }
    }

    return sentence
}


// Получение случайного числа --------------------------------------------------
function getRandomInt({ min, max }) {
    if (min == null) min = 0
    return (Math.random() * (max - min) | 0) + min
}
