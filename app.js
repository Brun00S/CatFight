const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json()); // Retornar um JSON
app.use(cors()); //Para não dar erro de cors
app.use(morgan("dev")); //Informações de log no terminal

//Rotas
const controller = require("./user/controllers/userControllers");

app.use("/", controller);

app.use("/:id", controller);

app.use("/update:id", controller);

app.use("/create", controller);

app.use("/del:id", controller);

module.exports = app;
