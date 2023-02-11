const express = require('express');

const {
    cadastrarPokemon,
    atualizarApelidoDePokemon,
    listarPokemons,
    listarPokemonPorId,
    excluirPokemon
} = require('./controllers/pokemon')

const {
    cadastrarUsuario,
    loginUsuario
} = require('./controllers/usuario')

const routes = express()

routes.post('/usuario', cadastrarUsuario);
routes.post('/login', loginUsuario);

routes.get('/pokemon', listarPokemons);
routes.post('/pokemon/cadastro', cadastrarPokemon);
routes.put('/pokemon/apelido', atualizarApelidoDePokemon);
routes.get('/pokemon/:id', listarPokemonPorId);
routes.delete('/pokemon/:id', excluirPokemon);