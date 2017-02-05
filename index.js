/**
 * Генерация текста на основе Цепи Маркова
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

// Генерация предложения
console.time('Генерация текста')
let randomSentence = generateText({ links, startWords })
console.timeEnd('Генерация текста')

// Вывод сгенеррированного предложения на экран
console.log(randomSentence)


/** ----------------------------------------------------------------------------
 * Подготовка звеньев
 * @param {string} input Исходный текст для создания звеньев
 * @return {object}
 *     links — Map-коллекция со звеньями,
 *     startWords — массив со списком слов для начала предления
 * @example
 * let input = fs.readFileSync('./input.txt', 'utf-8')
 * let { links, startWords } = prepareLinks({ input: })
 */
function prepareLinks({ input }) {
    let links = Map
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
    words = input.split(/[\n\s\xA0]+/).filter(item => item)

    // Заполняем звенья
    links = new Map()
    for (let word of new Set(words)) {
        // Это это последнее слово в предложении,
        // у него не может быть слов, которые идут после него,
        // следовательно, идём дальше
        if(word[word.length - 1].indexOf(/[.!?]/) > -1) {
            continue
        }

        // Ищем слова, которые встречаются после текущего
        // И добавляем их в список
        let index = words.indexOf(word)
        while(index > -1) {
            let nextWord = words[index + 1]
            if(nextWord == null) break

            // Добавляем ячейку
            links.has(word)
                ? links.get(word).set(links.get(word).size, nextWord)
                : links.set(word, new Map().set(0, nextWord))

            // Делаем новый поиск
            index = words.indexOf(word, index + 1)
        }
    }

    return { links, startWords }
}


/** ----------------------------------------------------------------------------
 * Функция генерациия текста
 * @param {Map} links Ассоциативный массив со списком звеньев
 * @param {array} startWords Массив со списком слов для начала предложения
 * @return {string} Сгенерированный текст
 */
function generateText({ links, startWords }) {
    let sentence = startWords[getRandomInt({ max: startWords.length })]
    let lastWord = sentence

    for(let i = 0; !/[.!?]/.test(sentence[sentence.length - 1]); i++) {
        if(!links.has(lastWord)) break

        let newWordIndex = getRandomInt({ max: links.get(lastWord).size })
        let newWord = links.get(lastWord).get(newWordIndex)

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


/** ----------------------------------------------------------------------------
 * Получение случайного числа
 * @param {integer} min Минимальное значение @default 0
 * @param {integer} max Максимальное значение
 */
function getRandomInt({ min = 0, max }) {
    return (Math.random() * (max - min) | 0) + min
}
