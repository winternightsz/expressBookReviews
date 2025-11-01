const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
        // Retrieve the email parameter from the request URL and send the corresponding friend's details
        const ISBN = req.params.isbn;
        res.send(books[ISBN]);  
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let authorBooks = {};
    const reqAuthor = req.params.author;
  
    // Goes through all object keys
    Object.keys(books).forEach(outerKey => {
      const innerObject = books[outerKey];
  
      // Verifies if the current books equals the requested book
      if (innerObject.author.toLowerCase() === reqAuthor.toLowerCase()) {
        // Adds the book to the response
        authorBooks[outerKey] = innerObject;
      }
    });
  
    // Returns response
    res.send(JSON.stringify(authorBooks,null,4));
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titledBooks = {};
    const reqTitle = req.params.title;
  
    // Goes through all object keys
    Object.keys(books).forEach(outerKey => {
      const innerObject = books[outerKey];
  
      // Verifies if the current books equals the requested book
      if (innerObject.title.toLowerCase() === reqTitle.toLowerCase()) {
        // Adds the book to the response
        titledBooks[outerKey] = innerObject;
      }
    });
  
    // Returns response
    res.send(JSON.stringify(titledBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    Object.keys(books).forEach(outerKey => {
        const innerObject = books[outerKey];
    
        // Verifies if the current books equals the requested book
        if (innerObject.isbn === ISBN) {
          const review = innerObject.review;
          res.send(JSON.stringify(review,null,4));
          return;
        }
      });
});

module.exports.general = public_users;
