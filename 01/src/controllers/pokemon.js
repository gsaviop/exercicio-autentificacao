const pool = require('../connect');

async function cadastrarPokemon(req, res) {
    const { nome, habilidades, imagem, apelido } = req.body;

    if(!nome || !habilidades) {
        return res.status(400).json({ "mensagem": 'Ambos os campos de nome e habilidade são obrigatórios' });
    }

    try {
        const query = `INSERT INTO pokemons
                            (usuario_id, nome, habilidades, imagem, apelido)
                        VALUES
                            ($1, $2, $3, $4, $5)
                        RETURNING * `;

        const params =  [req.usuario.id, nome, habilidades, imagem, apelido];
        
        const { rows } = await pool.query(query, params);

        return res.status(201).json(rows[0]);
        
    } catch (error) {
        return res.status(500).json({ "mensagem": 'Erro interno do servidor' });
    }
}

async function atualizarApelidoDePokemon(req, res) {
    const { apelido } = req.body;
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query(`SELECT * 
                                                FROM pokemons 
                                                WHERE id = $1`,
                                                [req.usuario.id]);

        if(!rowCount) {
            return res.status(404).json({"mensagem": "Pokémon não encontrado"});
        }                                        

        await pool.query(`UPDATE pokemons
                        SET apelido = $1
                        WHERE id = $2`,
                        [apelido, id]);

        return res.status(204).send();                                                 

    } catch (error) {
        return res.status(500).json({ "mensagem": 'Erro interno do servidor' });
    }
}

async function listarPokemons(req, res) {
    try {
        const { rows: pokemons } = await pool.query(`SELECT id, nome, habilidades, apelido, imagem
                                                    FROM pokemons
                                                    WHERE usuario_id = $1`,
                                                    [req.usuario.id]);

        for (const pokemon of pokemons) {
            pokemon.habilidades = pokemon.habilidades.split(", ");
            pokemon.usuario = req.usuario.nome;
        } 

        return res.json(pokemons);
        
    } catch (error) {
        return res.status(500).json({ "mensagem": 'Erro interno do servidor' });
    }
}

async function listarPokemonPorId(req, res) {

}

async function excluirPokemon(req, res) {

}

module.exports = {
    cadastrarPokemon,
    atualizarApelidoDePokemon,
    listarPokemons,
    listarPokemonPorId,
    excluirPokemon
}