# Генератор текста
Простой пример генерации случайного текста на основе Цепи Маркова

## Описание файлов
### `generator.js`
Основной скрипт, содержащий два метода:
  * Построение звеньев на основе исходного текста

  ```js
/**
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
  ```

  * Генерация текста на основе звеньев
  ```js
/**
 * Функция генерациия текста
 * @arg {object} :
 *     @param {Map} links Ассоциативный массив со списком звеньев
 *     @param {array} startWords Массив со списком слов для начала предложения
 *     @param {integer} amount Количество предложений @default 1
 * @return {string} Сгенерированный текст
 *
 * @example
 *     let text = generateText({ links, startWords, amount: 5})
 *     console.log(text)
 */
  ```

### `test.js`
Тестировочный скрипт

### `input.txt`
Пример исходного текста — cлучано взятый текст с [библиофонда](http://bibliofond.ru)
