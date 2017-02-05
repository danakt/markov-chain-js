/**
 * Генерация текста на основе Цепи Маркова
 * @author Danakt Frost <mail@danakt.ru>
 */

module.exports = {
    prepareLinks,
    generateText
}

/** ----------------------------------------------------------------------------
 * Подготовка звеньев
 * @arg {object} :
 *     @param {string} input Исходный текст для создания звеньев
 * @return {object} :
 *     @param {Map} links ассоциативный массив со звеньями,
 *     @param {array} startWords массив со списком слов для начала предления
 *
 * @example
 *     let input = fs.readFileSync('./input.txt', 'utf-8')
 *     let { links, startWords } = prepareLinks({ input })
 */
function prepareLinks({ input }) {
    // Сперва создаём массив со стартовыыми словами
    let startWords = input
        .match(/(^|[!?.]\s)([А-Я][а-я]+)(\s|$)/gm)
        .map(item => item.replace(/[^А-я]/g, ''))

    let words = input
        // Заменяем все символы разделения слов на человеческие
        .replace(/[\t\n\v\f\r\s\xA10]/g, ' ')
        // Удаляем ненужные символы
        .replace(/[^A-zА-я0-9 -\!\?\.,:]/g, '')
        // Разбиваем текст на массив
        .split(' ').filter(item => item)

    // Заполняем звенья
    let links = new Map()
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

            // Останавливаем цикл, если следующая ячейка пустая
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
 * @arg {object} :
 *     @param {Map} links Ассоциативный массив со списком звеньев
 *     @param {array} startWords Массив со списком слов для начала предложения
 *     @param {integer} amount Количество предложений @default 1
 * @return {string} Сгенерированный текст
 */
function generateText({ links, startWords, amount = 1 }) {
    let sentence = startWords[Math.random() * startWords.length | 0]
    let lastWord = sentence

    for(let i = 0; !/[.!?]/.test(sentence[sentence.length - 1]); i++) {
        if(!links.has(lastWord)) break

        let newWordIndex = Math.random() * links.get(lastWord).size | 0
        let newWord = links.get(lastWord).get(newWordIndex)

        lastWord = newWord
        sentence += ' ' + newWord

        if(i > 30) {
            // Если получилось много слов в предложении,
            // например начала повторяться какая-то фраза,
            // пробуем заново составить предложение
            return generateText({ links, startWords, amount })
        }
    }

    // Генерируем следующее предложение
    let nextSentence = Math.max(amount, 1) > 1
        ? ' ' + generateText({ links, startWords, amount: amount - 1 })
        : ''

    return sentence + nextSentence
}