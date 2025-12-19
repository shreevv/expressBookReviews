const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const userExists = users.find((user) => user.username === username);
    if (!userExists) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an asynchronous call to fetch the books object
    const getBooks = await Promise.resolve(books);
    res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const allBooks = await Promise.resolve(books);
    const keys = Object.keys(allBooks);
    const filteredBooks = keys
      .filter(key => allBooks[key].author === author)
      .map(key => allBooks[key]);

    if (filteredBooks.length > 0) {
      res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error filtering books by author" });
  }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const filteredBooks = keys
      .filter(key => books[key].title === title)
      .map(key => books[key]);

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then((results) => res.status(200).send(JSON.stringify(results, null, 4)))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;