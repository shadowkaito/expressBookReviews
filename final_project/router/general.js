const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            console.log(users)
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
    // return res.status(300).json({ message: "Yet to be implemented" });
});

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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(books);
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbnNumber = req.params.isbn;
    if (books[isbnNumber]) {
        return res.send(books[isbnNumber]);
    } else {
        return res.send("No book found with the isbn :" + isbnNumber);
    }
    //   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    let booksFromAuthor = {};
    
    Object.keys(books).forEach((bookId) => {
        if(books[bookId].author == author){
            booksFromAuthor[bookId] = books[bookId];
        }
    });
    if(Object.keys(booksFromAuthor).length == 0){
        return res.send("No books found from this author");
    }else{
        return res.send(booksFromAuthor);
    }
    

    // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    let booksFromTitle = {};
    
    Object.keys(books).forEach((bookId) => {
        if(books[bookId].title == title){
            booksFromTitle[bookId] = books[bookId];
        }
    });

    if(Object.keys(booksFromTitle).length == 0){
        return res.send("No books found with this title");
    }else{
        return res.send(booksFromTitle);
    }
    // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbnNumber = req.params.isbn;
    return res.send(books[isbnNumber].reviews);
    // return res.status(300).json({ message: "Yet to be implemented" });
});

//PART WITH AXIOS
public_users.get('/axios/books', function (req, res) {
    axios.get('http://localhost:5000/')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error("Error no book found", error);
            res.status(500).send("Error no book found");
        });
});
public_users.get('/axios/isbn/:isbn', function (req, res) {
    axios.get('http://localhost:5000/isbn/:isbn')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error("Error no book founded with this isbn", error);
            res.status(500).send("Error no book founded with this isbn");
        });
});
public_users.get('/axios/author/:author', function (req, res) {
    axios.get('http://localhost:5000/author/:author')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error("Error no book founded with this author :", error);
            res.status(500).send("Error no book founded with this author");
        });
});
public_users.get('/axios/title/:title', function (req, res) {
    axios.get('http://localhost:5000/title/:title')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error("Error no book founded with this title : ", error);
            res.status(500).send("Error no book founded with this title : ");
        });
});


module.exports.general = public_users;
