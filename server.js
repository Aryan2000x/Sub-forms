require("dotenv").config();
const express = require("express");
// const bodyParser = require('body-parser');
const path = require('path')
const cookieparser = require('cookie-parser')
const app = express()
const routes = require("./routes")

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, '')));

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
app.use(cookieparser());
app.use(express.json());

app.use("/", routes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

