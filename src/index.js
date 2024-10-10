const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");


const PORT = 4000;
const app = express();

const REDIS_HOST = "redis";
const REDIS_PORT = 6379;
const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
}); 
redisClient.on('error', (err)=> console.log('Redis Client Error', err));
redisClient.on('connect', ()=> console.log('Connected to redis'));
redisClient.connect();

const DB_USER = "root"
const DB_PASSWORD = "example"
const DB_HOST = "mongo"
const DB_PORT = 27017
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
mongoose.connect(URI)
    .then(() => console.log('connected to db'))
    .catch((err) => console.log('failed to connect to db', err));

app.get("/", (_, res) => {
    redisClient.set("products", "books");
    return res.json({message: "product has been successfully saved!"});
});

app.get("/data", async (_, res)=> {
    const product = await redisClient.get("products")
    return res.json({message: `Your product: ${product}`})
})

app.listen(PORT, ()=> console.log(`App is running on port: ${PORT}`));