const express = require("express");
const mongoose = require("mongoose");


const PORT = 4000;
const app = express();

const DB_USER = "root"
const DB_PASSWORD = "example"
const DB_HOST = "mongo"
const DB_PORT = 27017

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
mongoose.connect(URI)
    .then(() => console.log('connected to db'))
    .catch((err) => console.log('failed to connect to db', err));

app.get('/', (req, res) => res.json({
    message: "successful"
}))

app.listen(PORT, ()=> console.log(`App is running on port: ${PORT}`));