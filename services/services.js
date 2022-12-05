'use strict'


const STORAGE_KEY = 'titleDB'
const gTitles = ['Oren', 'kot', 'salomon', 'puki']
const gPrices = [100, 200, 300, 400]
const PAGE_SIZE = 5

var gPageIdx = 0
var gCurrId
var gBooks
var gFilterBy = { minPrice: 100, minRating: 1, title: '' }
_createBooks()


function getAllBooks() {
    console.log('gBooks', gBooks);
    return { books: gBooks }
}
function getPageSize() {
    var pages = gBooks.length / PAGE_SIZE
    return { pages: pages }
}


function getPageIdx() {
    return gPageIdx
}

function nextPage() {
    gPageIdx++
    console.log('gPageIdx', gPageIdx);
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function previousPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
    }
}

function bySetFilter(filterBy) {
    gPageIdx = 0
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    if (filterBy.minRating !== undefined) gFilterBy.minRating = filterBy.minRating
    // need to support all the capital letters
    return gFilterBy
}

function getBooks() {
    var books = gBooks.filter(book => book.rating >= gFilterBy.minRating &&
        book.price >= gFilterBy.minPrice && book.title.includes(gFilterBy.title))
    console.log(gFilterBy);

    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}


function addRating(book) {
    if (book.rating === 10) return
    book.rating++
    _savebookToStorage()
}

function lessenRating(book) {
    if (book.rating === 1) return
    book.rating--
    _savebookToStorage()
}

function getCurrId(bookId) {
    gCurrId = bookId
    return gCurrId
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newPrice
    _savebookToStorage()
}


function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.unshift(book)
    _savebookToStorage()
}

function deleteBook(bookId) {
    const book = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(book, 1)
    _savebookToStorage()
}


function _createBook(title, price) {
    return {
        id: makeId(),
        title,
        price,
        desc: makeLorem(),
        rating: 1,
    }
}

function _createBooks() {
    var book = loadFromStorage(STORAGE_KEY)
    if (!book || !book.length) {
        book = []
        for (let i = 0; i < 27; i++) {
            var title = gTitles[getRandomIntInclusive(0, gTitles.length - 1)]
            var price = gPrices[getRandomIntInclusive(0, gPrices.length - 1)]
            book.push(_createBook(title, price))
        }
    }
    gBooks = book
    _savebookToStorage()
}

function _savebookToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}