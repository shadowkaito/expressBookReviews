const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        req.session.save((err) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde de la session :", err);
                return res.status(500).json({ error: "Erreur serveur" });
            }
            return res.status(200).send("User successfully logged in");
        });   
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
    //   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    console.log(req.session.authorization);
    let isbn = parseInt(req.params.isbn);
    let review = req.body.review;
    let username = req.user;

    //Retrieve the reviews of the books
    let reviews = books[isbn].reviews;
    console.log(reviews);
    if (reviews[username]) {
        reviews[username] = review;
        return res.status(200).json({ message: "Review Updated" });
    } else {
        reviews.push({username,review });
        return res.status(200).json({ message: "Review added" });
    }

    // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
