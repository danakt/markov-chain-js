const fs     = require('fs')
const path   = require('path')
const expect = require('chai').expect
const { prepareLinks, generateText } = require('./generator')

const inputText = fs.readFileSync('./input.txt', 'utf-8')
const { links, startWords } = prepareLinks(inputText)

describe('Подготовка звеньев', () => {
    it(`Провекра количества звеньев`, () => {
        expect(links.size).to.be.above(0);
        expect(startWords).to.have.length.above(0)
    })
})

describe('Генерация текста', () => {
    it(`1 предложение`, () => {
        const sentece = generateText(links, startWords)
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(1)
    })

    it(`2 предложения`, () => {
        const sentece = generateText(links, startWords, 2)
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(2)
    })

    it(`5 предложений`, () => {
        const sentece = generateText(links, startWords, 5)
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(5)
    })

    it(`15 предложений`, () => {
        const sentece = generateText(links, startWords, 15)
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(15)
    })

    it(`100 предложений`, () => {
        const sentece = generateText(links, startWords, 100)
        expect(sentece.match(/[\.\?\!](\s|$)/g)).to.have.length(100)
    })
})
