const axios = require('axios')

module.exports =  Clientes = {
	uri: 'http://www.mocky.io/v2/598b16291100004705515ec5',
	getAll: async function () {
		let listaClientes = await axios.get( this.uri )
		.then(function (response) {
			
			return response.data;

		})
		.catch(e=>console.log("Erro"))

		indiceClientes = Utils.makeListaIndice(listaClientes, 'id');

		return indiceClientes;
	},
	getByID: async function (id) {
		let listaClientes = await axios.get( this.uri )
		.then(function (response) {
			
			let data = response.data.filter(
				cliente=>(cliente.id === id )
			);
	
			return data;
		})
		.catch(e=>console.log("Erro"))

		return listaClientes.shift();
	}
}