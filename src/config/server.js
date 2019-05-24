// Imports =========================================================
// O Express é o framework que usaremos para a criacāo da nossa API
const express = require('express')

// O Consign é um módulo que vai nos auxiliar com modularização
const consign = require('consign')

// O Body-Parser é um módulo nativo do Node que facilita o acesso
// ao 'body' das requisições
const bodyParser = require('body-parser')
// =================================================================
const cors = require('cors')

const server = express()

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors())

consign()
    .include('./src/config/firebaseConfig.js')
    .include('./src/app/routes')
    .into(server)

module.exports = server;
