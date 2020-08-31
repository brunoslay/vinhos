
const express = require('express');
const axios = require('axios')
const path = require('path');

const  Clientes  =  require('./services/Clientes.js');
const  HistoricoVendas  =  require('./services/HistoricoVendas.js');
const Utils = require("./services/Utils");


const app = express();
const port = 3000;




app.get('/', async (req, res) => {
	
	res.sendFile(path.join(
		__dirname+'/index.html'
	));

	
})


app.get('/clientes', async (req, res) => {

	HistoricoVendas.recomendarByCliente(req.query.id)
	.then(favorito=>{
		res.json(favorito)
	});
	
})

app.get('/clientes/melhores', async (req, res) => {
	await HistoricoVendas.getMelhoresClientes()
	.then(vendas=>{
		res.json(vendas);
	})
})

app.get('/vendas/melhor-compra-ultimo-ano', async (req, res) => {

	HistoricoVendas.getMelhorCompraUltimoAno()
	.then(venda=>{
		res.json(venda);
	})
	
})

app.get('/clientes/frequencia', async (req, res) => {
	HistoricoVendas.getFrequenciaClientes()
	.then(clientes=>(res.json(clientes)))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
