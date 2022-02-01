// modules 
const express =  require("express");
const mongoose =  require("mongoose");
const bobyParser =  require("body-parser");
const cors = require("cors");

// routes

//  middlewares

// config
const dbName = "partytimeb";
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
//atrelar as rotas no express 

// conexao mongodb
mongoose.connect(
  `mongodb://localhost/${dbName}`,
  {
    useNewUrlParser: true,
    //useFindAndModify: true,
    //useUnifiedTopalogy: true
  }
);

app.get("/", (req, res) => {
  res.json({ message: "Rota teste1"});

});

app.listen(port, () => {
  console.log(`o backend está rodando na porta ${port}`);
})