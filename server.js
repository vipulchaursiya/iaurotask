const express = require("express");
const app = express(); //set up express server
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require("cors");
require("./db.js"); //set up database connection
app.use(bodyParser.json()); 
app.use(cors());
const port = 4000

app.use(morgan('dev'));

const usersRoute = require("./routes/users.route");
const productRoute = require("./routes/products.route");

app.use("/api/users", usersRoute);
app.use("/api/products", productRoute);

const appServer = app.listen(4000, () => console.log(`Backend app listening on port ${port}!`));