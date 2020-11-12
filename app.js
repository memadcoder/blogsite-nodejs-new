const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./router/routes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

mongoose
  .connect("mongodb://localhost/personalBlog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen("4000");
    console.log("Server started at 4000");
  })
  .catch((error) => console.log(error));
