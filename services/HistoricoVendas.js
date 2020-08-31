const axios = require('axios')
const  VendasBuilder  =  require('./VendasBuilder.js');
const Utils = require('./Utils.js');
const Clientes = require('./Clientes.js');




module.exports =  HistoricoVendas = {
	uri: 'http://www.mocky.io/v2/598b16861100004905515ec7',
	getAll: async function () {
		let retorno = await axios.get( this.uri )
		.then(function (response) {
			
			// console.log(response.data)
			return response.data;

		})
		.catch(e=>console.log("Erro"))

		// console.log(retorno);
		return retorno;
	},
	getByCliente: async function (cliente) {
		let retorno = await axios.get( this.uri )
		.then(function (response) {
			
			let data = response.data.filter(
				venda=>(vendidCliente === cliente ) 
			);
	
			return data;
		})
		.catch(e=>console.log("Erro"))

		console.log(retorno);
	},
	ordenaMelhores:  async function () {
		
		const vendas = await this.getAll();
		const melhoresVendas = Utils.orderByDesc(vendas, 'valorTotal');
		// const melhoresVendas =  vendas.sort((a,b)=>(b.valorTotal-a.valorTotal));

		return melhoresVendas;
	},

	getMelhoresClientes:  async function () {

		const vendas = await this.getAll();
		let listaClientes = await VendasBuilder.makeTotalComprasCliente(vendas);

		listaClientes = Utils.orderByDesc(listaClientes, 'total');

		return listaClientes;
	},

	getMelhorCompraUltimoAno:  async function () {

		const vendas = await this.getAll();
		anos = [];
		
		vendas.map(_venda=>{
			
			let anoVenda = Number(_venda.data.split('-').pop());
			anos.includes(anoVenda) ? '' : anos.push(anoVenda);
			
		})
		
		vendasAno = [];
		ultimoAno = Math.max(...anos);

		vendas.map(_venda=>{

			let anoVenda = Number(_venda.data.split('-').pop());

			if (anoVenda === ultimoAno) vendasAno.push(_venda);
		})
		
		melhorVendaAno = Utils.orderByDesc(vendasAno, 'valorTotal').shift();

		let idCliente = Number(melhorVendaAno.cliente.substr(-2));
		let cliente;
		
        await Clientes.getByID(idCliente).then(_cliente=>{
			cliente = _cliente;
			melhorVendaAno.nome = _cliente.nome
		});

		return melhorVendaAno;
		
	},

	getFrequenciaClientes: async function(){

		let vendas = await this.getAll();

		ocorrencia = {};

		vendas.map(function(_venda){
			idCliente = Number(_venda.cliente.substr(-2));
			ocorrencia[idCliente] = [];
		})
		
		vendas.map(function(_venda){
			idCliente = Number(_venda.cliente.substr(-2));
			ocorrencia[idCliente].push(idCliente)
		})

		let clientes;
		await Clientes.getAll().then(_clientes=>{
			clientes = _clientes;
		});
		

		for (const key in ocorrencia) {
			if (ocorrencia.hasOwnProperty(key)) {
				const element = ocorrencia[key];

				ocorrencia[key] = {
					id: key,
					nome: clientes[key].nome,
					numeroCompras: ocorrencia[key].length
				};
				
			}
		}

		ocorrencia = Object.values(ocorrencia);
		ocorrencia = Utils.orderByDesc(ocorrencia, 'numeroCompras');

		return ocorrencia;
	},

	recomendacaoVinhos: {},
	recomendarByCliente: async function (id) {

		let melhoresVendas;
		await this.getMelhoresClientes().then(_topVendas=>{
			melhoresVendas = _topVendas;
		})


		let clientes;
		await Clientes.getAll().then(_clientes=>{
			clientes = Object.values(_clientes);
		})


		indiceVinhos = {};
		
		melhoresVendas.map(_venda=>{


			indiceVinhos[_venda.cpf] = {
				id: _venda.cpf,
			};

			_venda.itens.map(nomeVinho=>{
				indiceVinhos[_venda.cpf][nomeVinho] = [];
			})
			
		});

		melhoresVendas.map(_venda=>{

			_venda.itens.map(nomeVinho=>{
				indiceVinhos[_venda.cpf][nomeVinho].push(nomeVinho);
			})
			
		});

		indiceVinhosTotaais = {};
		melhoresVendas.map((_venda, id)=>{

			_venda.itens.map(nomeVinho=>{
				indiceVinhosTotaais[_venda.cpf] = {};
			})

			for (const key in indiceVinhosTotaais) {
				if (indiceVinhosTotaais.hasOwnProperty(key)) {
					const element = indiceVinhosTotaais[key];

					_venda.itens.map(nomeVinho=>{
		
						indiceVinhosTotaais[key][nomeVinho] = indiceVinhos[_venda.cpf][nomeVinho].length
					})
	
					
				}
			}
			
		});


		original = indiceVinhosTotaais[id];
		chaves = Object.keys(indiceVinhosTotaais[id]);
		valores = Object.values(indiceVinhosTotaais[id]);

		favoritos = [];
		
		valores.filter((totalVinho, a, b)=>{

			if(totalVinho >= Math.max(...b)){
				favoritos.push(chaves[a]);
			}
			
		})
		
		return favoritos;
		
	}
}