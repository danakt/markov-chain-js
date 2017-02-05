// Зависимости -----------------------------------------------------------------
const fs     = require('fs')
const path   = require('path')
const expect = require('chai').expect
const { prepareLinks, generateText } = require('./generator')

// Подготовка ------------------------------------------------------------------
let inputText = fs.readFileSync('./input.txt', 'utf-8')
let { links, startWords } = prepareLinks({ input: inputText })

// Проверка --------------------------------------------------------------------
describe('Подготовка звеньев', () => {
    it(`Провекра количества звеньев`, () => {
        expect(links.size).to.be.above(0);
        expect(startWords).to.have.length.above(0)
    })
})

describe('Генерация текста', () => {
    it(`1 предложение`, () => {
        let sentece = generateText({ links, startWords })
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(1)
    })

    it(`2 предложения`, () => {
        let sentece = generateText({ links, startWords, amount: 2 })
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(2)
    })

    it(`5 предложений`, () => {
        let sentece = generateText({ links, startWords, amount: 5 })
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(5)
    })

    it(`15 предложений`, () => {
        let sentece = generateText({ links, startWords, amount: 15 })
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(15)
    })

    it(`100 предложений`, () => {
        let sentece = generateText({ links, startWords, amount: 100 })
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(100)
    })
})
