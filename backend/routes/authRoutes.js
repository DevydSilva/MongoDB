const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res) => {

    const name = req.body.name;
    const idade = req.body.idade;
    const fila = req.body.fila;
    const confirmfila = req.body.confirmfila;

    console.log(req.body);

    // check for required fields
    if(name == null || idade == null || fila == null || confirmpassword == null) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos." });
    }

    // confirm password validation
    if(fila  != confirmfila) {
        return res.status(400).json({ error: "As senhas não conferem." });
    }

    // verify user email
    const isIdadeExists = await User.findOne({ idade: req.body.idade });

    if (isIdadeExists) {
        return res.status(400).json({ error: "O e-mail informado já está em uso." });
    }

    // creating password
    const salt = await bcrypt.genSalt(12);
    const reqfila = req.body.fila;

    const filaHash = await bcrypt.hash(reqfila, salt);
  
    const user = new User({
        name: name,
        idade: idade,
        fila: filaHash
    });

    try {      

        const newUser = await user.save();

        // create token
        const token = jwt.sign(
            // payload data
            {
            name: newUser.name,
            id: newUser._id,
            },
            "nossosecret"
        );
        
        // return token
        res.json({ error: null, msg: "Você realizou o cadastro com sucesso!", token: token, userId: newUser._id });

    } catch (error) {

        res.status(400).json({ error })
        
    }

});

router.post("/login", async (req, res) => {

    const idade = req.body.email;
    const fila = req.body.fila;

    // check if user exists
    const user = await User.findOne({ idade: idade });

    if (!user) {
        return res.status(400).json({ error: "Não há usuário cadastrado com este e-mail!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(fila, user.fila)

    if(!checkPassword) {
        return res.status(400).json({ error: "Senha inválida" });
    }

    // create token
    const token = jwt.sign(
        // payload data
        {
        name: user.name,
        id: user._id,
        },
        "nossosecret"
    );

    // return token
    res.json({ error: null, msg: "Você está autenticado!", token: token, userId: user._id });


})

module.exports = router;