//Book Class : Represents a Book
class Book {
	constructor (title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

//UI Class : Handle UI Tasks
class UI {
	//UI methods will be static since we dont need to instantiate the UI class
	static displayBooks () {
		const books = Store.getBooks();

		//Loop through each book and call method addBookToList

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList (book) {
		const list = document.querySelector('#book-list');

		const row = document.createElement('tr');
		row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td> `;
		list.appendChild(row);
	}

	static clearFields () {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}

	//Static method deleteBook which accepts the target element on which we have clicked and checks if the target element has the class delete which means we have clicked on the delete button
	static deleteBook (el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	//When all the felds are not filled or there are only spaces in any of the field showAlert static method is called .

	static showAlert (messg, className) {
		const alertDiv = document.createElement('div');
		alertDiv.className = `alert alert-${className}`;
		alertDiv.textContent = `${messg}`;
		//Grab the container class and the form class and insert the alert div before the form element

		const form_parent = document.querySelector('.form-parent');
		const form = document.querySelector('#book-form');
		form_parent.insertBefore(alertDiv, form);

		//Vanish alert after 2 seconds

		setTimeout(() => document.querySelector('.alert').remove(), 2000);
	}
}

//Store Class : Handles Storage : Localstorage stores key value pairs in string format so before storing anything to localstorage we have stringyfy it using JSON stringyfy
class Store {
	static getBooks () {
		let books;
		if (localStorage.getItem('books') === null) {
			//If there is no item as books in localstorage then set books as empty array
			books = [];
		} else {
			//JSON.parse method is use to convert string to javascript object
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static addBook (book) {
		const books = Store.getBooks();
		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook (isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));
	}
}

//Events : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//Events : Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
	//Prevent Default Submit
	e.preventDefault();

	//Get form values

	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//Validate the fields before createing a book object

	if (title.trim() === '' || author.trim() === '' || isbn.trim() === '') {
		UI.showAlert('Please fill all the fields', 'danger');
	} else {
		//Create an object of the book class
		const book = new Book(title, author, isbn);

		//Calling the addBookToList static method and passing the created book Object
		UI.addBookToList(book);

		//After adding  book call addBook static method of Storage class
		Store.addBook(book);

		//Show Alert
		UI.showAlert('Book Added Successfully', 'success');

		//Clear Fields method after adding book

		UI.clearFields();
	}
});

//Events : Remove a Book

//At first we select the book-list tbody and then add event listener of click and then we pass the event of click and by using e.target we get the element on which we have clicked
document.querySelector('#book-list').addEventListener('click', (e) => {
	UI.deleteBook(e.target);

	//Remove book from localstorage
	const isbn = e.target.parentElement.previousElementSibling.textContent;
	Store.removeBook(isbn);
	//Show Alert
	UI.showAlert('Book Removed Successfully', 'success');
});
