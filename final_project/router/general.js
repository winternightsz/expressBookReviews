const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,4));
// });

// Get the list of books using Axios (Promise callbacks)
const axios = require('axios');

public_users.get('/', function (req, res) {
  axios.get('http://localhost:5000/books') 
    .then(response => {
      
      res.status(200).json(books); 
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error fetching book list" });
    });
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//         // Retrieve the email parameter from the request URL and send the corresponding friend's details
//         const ISBN = req.params.isbn;
//         res.send(books[ISBN]);  
//  });

public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
  
    axios.get(`http://localhost:5000/books/${ISBN}`) 
      .then(response => {
        
        res.status(200).json(books[ISBN]);
      })
      .catch(error => {
        console.error("Error fetching book by ISBN:", error.message);
        res.status(500).json({ message: "Error fetching book details" });
      });
  });
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     let authorBooks = {};
//     const reqAuthor = req.params.author;
  
//     // Goes through all object keys
//     Object.keys(books).forEach(outerKey => {
//       const innerObject = books[outerKey];
  
//       // Verifies if the current books equals the requested book
//       if (innerObject.author.toLowerCase() === reqAuthor.toLowerCase()) {
//         // Adds the book to the response
//         authorBooks[outerKey] = innerObject;
//       }
//     });
  
//     // Returns response
//     res.send(JSON.stringify(authorBooks,null,4));
//   });
public_users.get('/author/:author', function (req, res) {
    const reqAuthor = req.params.author.toLowerCase();
  
    axios.get('http://localhost:5000/books') 
      .then(response => {
        const allBooks = books; 
        let authorBooks = {};
  
        
        Object.keys(allBooks).forEach(key => {
          const book = allBooks[key];
          if (book.author.toLowerCase() === reqAuthor) {
            authorBooks[key] = book;
          }
        });
  
       
        res.status(200).json(authorBooks);
      })
      .catch(error => {
        console.error("Error fetching books by author:", error.message);
        res.status(500).json({ message: "Error fetching books by author" });
      });
  });
  

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     let titledBooks = {};
//     const reqTitle = req.params.title;
  
//     // Goes through all object keys
//     Object.keys(books).forEach(outerKey => {
//       const innerObject = books[outerKey];
  
//       // Verifies if the current books equals the requested book
//       if (innerObject.title.toLowerCase() === reqTitle.toLowerCase()) {
//         // Adds the book to the response
//         titledBooks[outerKey] = innerObject;
//       }
//     });
  
//     // Returns response
//     res.send(JSON.stringify(titledBooks,null,4));
// });
public_users.get('/title/:title', function (req, res) {
    const reqTitle = req.params.title.toLowerCase();
  
    axios.get('http://localhost:5000/books') 
      .then(response => {
        const allBooks = books; 
        let titledBooks = {};
  
        
        Object.keys(allBooks).forEach(key => {
          const book = allBooks[key];
          if (book.title.toLowerCase() === reqTitle) {
            titledBooks[key] = book;
          }
        });
  
        res.status(200).json(titledBooks);
      })
      .catch(error => {
        console.error("Error fetching books by title:", error.message);
        res.status(500).json({ message: "Error fetching books by title" });
      });
  });

//  Get book review.
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    const review = book.reviews;
    res.send(JSON.stringify(review,null,4));
});

module.exports.general = public_users;
