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
} = require('./controllers/usuario');

const VerifyLoggedIn = require('./middlewares/authentification');


const routes = express();

routes.post('/usuario', cadastrarUsuario);
routes.post('/login', loginUsuario);

routes.use(VerifyLoggedIn);

routes.get('/pokemon', listarPokemons);
routes.post('/pokemon/cadastro', cadastrarPokemon);
routes.patch('/pokemon/:id', atualizarApelidoDePokemon);
routes.get('/pokemon/:id', listarPokemonPorId);
routes.delete('/pokemon/:id', excluirPokemon);

module.exports = routes;