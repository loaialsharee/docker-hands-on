const express = require("express");


const PORT = 4000;
const app = express();

app.get('/', (req, res) => res.json({
    message: "successful"
}))

app.listen(PORT, ()=> console.log(`App is running on port: ${PORT}`));