const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')



app.use(express.json())
app.use(cors())
dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})


db.connect((err) => {
    if (err) return console.log("Error connecting to mysql")
    console.log("Connected to MySQL:", db.threadId)

    db.query(`CREATE DATABASE IF NOT EXISTS expense_tracker`, (err, result) => {
        if (err) return console.log(err)
        console.log("Database expense_tracker created/checked")

        //select our db
        db.changeUser({ database: 'expense_tracker' }, (err) => {
            console.log("changed to expense_tracker")

            //create users table
            const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(100) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL
        )
      `;
            db.query(createUsersTable, (err, result) => {
                if (err) return console.log(err)

                console.log("users table checked/created ");
            })
        })

    })
})


//user registration route
app.post('', async(req, res) => {
    try{
        const users = `SELECT * FROM users WHERE email =?`

        db.query(users, [req.body.email], (err, data) => {
            if (data.length) return res.status(409).json("User already exists");

            const newUser = `INSERT INTO users(email, username, password) VALUES (?)`

            values = [
                req.body.email,
                req.body.username,
                req.body.password
            ]
        })
        db.query(newUser, [value], (err, data) =>{
            if(err) res.status(500).json("Something went wrong")

            return res.status(200).json("user created successfully");
        })
    } 
    catch(err) {
        res.status(500).json("Internal Server Error")
    }
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})

