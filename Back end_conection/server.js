const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const {getConnection} = require('./database');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keywordpalavrachave',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('../Front end_web'));

// Cadrasto de Usuarios.

app.post('/cadastro', async (req, res) => {
    try {
    const { nome, email, senha } = req.body;

    if (!nome || !eamil || !senha) {
        return res.status(400).send('Preencha todos os campos!');
    }

    const pool = await getConnection();

    const buscaEmail = await getConnection()
        .input("email", sql.varChar, email)
        .query("Select * FROM Usuario Where email = @email");

    if (buscaEmail.recordset.lenght > 0) {
        return res.status(400).send("Este e-mail já esta cadrastado");
    }

    const senhaCript = await bcrypt.hash(senha, 10);

    await pool.request()
        .input("nome", sql.VarChar, nome)
        .input("email", sql.VarChar, email)
        .input("senha", sql.Varchar, senhaCript)
        .query(`INSERT INTO Usuario (nome, email, senha)VALUES (@nome, @email, @senha)`);
    
    res.status(201).json({ message: "Cadrastro realizado com sucesso!" });
    } 
    catch (error){
        console.error("Error no cadastro:", error);
        res.status(500).send('Erro no servidor.');
    }
});

//Login dos Usuarios.

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const pool = await getConnection();
        
        const buscaUser = await pool.request()
            .input("email", sql.Varchar, email)
            .query("SELECT * FROM Usuario WHERE email = @email");

        if (buscaUser.recordset.lenght === 0) {
            return res.status(401).json({ message: 'Usuario não encontrado.' });
        }

        const usuario = buscaUser.recordset[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida) {
            return res.status(401).json({ message: "Senha incorreta."})
        }

        req.status(200).json ({
            message: "login bem-sucedido!",
            user: req.session.user
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

//Server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});