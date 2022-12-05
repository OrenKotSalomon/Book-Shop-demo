


function onInit() {
    // console.log('2');
    renderFilterByQueryStringParams()
    renderBooks()
}



function renderBooks() {
    var books = getBooks()
    var strHtmls = books.map(book => `
    <tr>
          <td class="book-id">${book.id}</td>
                <td class="title">${book.title}</td>
                <td class="price" min="0"
                max="1000">${book.price}</td>
                <td class="rating" min="1"
                max="10">${book.rating}</td>
                <td class="img"><img onerror="this.src='img/book1.png'" src="img/${book.title}.png" alt="book by ${book.title}"></td>
                <td class="action"> <button class="read-desc" onclick="onReadDescription('${book.id}')">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onDeleteBook('${book.id}')">Delete</button>
                </td>
     </tr>
    `
    )
    document.querySelector('.table-container').innerHTML = strHtmls.join('')
}



function onClickSubmit() {

}

function onClickForm(ev) {
    ev.preventDefault()

}

function onSetFilterBy(filterBy) {
    filterBy = bySetFilter(filterBy)
    renderBooks()

    const queryStringParams = `?minRating=${filterBy.minRating}&minPrice=${filterBy.minPrice}&title=${filterBy.title}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        minRating: +queryStringParams.get('minRating') || 1,
        minPrice: +queryStringParams.get('minPrice') || 100,
        title: queryStringParams.get('title') || '',
    }

    if (!filterBy.minRating && !filterBy.minPrice && !filterBy.title) return

    document.querySelector('.filter-rating-range').value = filterBy.minRating
    document.querySelector('.filter-price-range').value = filterBy.minPrice
    document.querySelector('.filter-txt-search').value = filterBy.title
    bySetFilter(filterBy)
    // NEED TO ADD BOOKMARK ABILITY
}

function onAddRating() {
    var currbook = getCurrId(gCurrId)
    var book = getBookById(currbook)
    addRating(book)
    var elRating = document.querySelector('.rating')
    elRating.innerText = book.rating
    renderBooks()
}

function onLessenRating() {
    var currbook = getCurrId(gCurrId)
    var book = getBookById(currbook)
    lessenRating(book)
    var elRating = document.querySelector('.rating')
    elRating.innerText = book.rating
    renderBooks()

}



function onCloseModal() {
    var elModal = document.querySelector('.modal-container')
    elModal.classList.add('hide')
}


function onReadDescription(bookId) {
    var book = getBookById(bookId)
    var elRating = document.querySelector('.rating')
    var elModal = document.querySelector('.modal-container')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('.desc-modal').innerText = book.desc
    elRating.innerText = book.rating
    elModal.classList.remove('hide')
    getCurrId(bookId)
}



function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    var newPrice = +prompt('Update the price...')
    if (newPrice && book.maxPrice !== newPrice) {
        updateBook(bookId, newPrice)
        renderBooks()
    }

}


function onAddBook() {
    var title = prompt('title ?')
    var price = +prompt('price ?')
    if (title || price) {
        const book = addBook(title, price)
        renderBooks()
        // flashMsg(`Car Deleted`)
    }

}


function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    // flashMsg(`Car Deleted`)
}


function onNextPage() {
    nextPage()
    disableNextButton()
    disablePrevButton()
    renderBooks()
}

function onPreviousPage() {
    previousPage()
    disableNextButton()
    disablePrevButton()
    renderBooks()
}



function disablePrevButton() {
    var pageIdx = getPageIdx()
    var elPrevPage = document.querySelector('.prev-page')
    console.log(pageIdx);
    elPrevPage.disabled = (!pageIdx) ? true : false
}


function disableNextButton() {
    var allBooks = getAllBooks()
    var pagesSize = getPageSize()
    var pageIdx = getPageIdx()
    var elNextPage = document.querySelector('.next-page')
    console.log(pageIdx);
    if (gPageIdx * pagesSize.pages >= allBooks.books.length - pageIdx) {

        elNextPage.disabled = true
    } else { elNextPage.disabled = false }
}