const pool = require('../connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenPassword = require('../tokenPassword');

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
             VALUES ($1, $2, $3)
             RETURNING *`, [nome, email, senhaCriptografada]
        )

        return res.status(201).json(novoUsuario.rows[0])

    } catch (error) {
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body;

    try {
        const usuario = await pool.query(`SELECT * FROM usuarios
        WHERE email = $1`, [email]);

        if(usuario.rowCount < 1) {
            return res.status(404).json({"mensagem": "usuário não encontrado"});
        }
        
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if(!senhaValida) {
            return res.status(400).json({"mensagem": "e-mail ou senha inválido"});
        }

        const token = jwt.sign({id: usuario.rows[0].id}, tokenPassword, {expiresIn: '8h'});

        const { senha: _, ...usuarioAutentificado } = usuario.rows[0];

        return res.json({usuario: usuarioAutentificado, token});
        
    } catch (error) {
        return res.status(500).json({"mensagem": "Erro interno do servidor"});
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}