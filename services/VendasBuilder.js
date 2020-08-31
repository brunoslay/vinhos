module.exports =  VendasBuilder = {

    vendas: null,
    listaClientes: {},

    criarIndicesClientes: function () {
           
        this.vendas.map((_venda)=> {
			
            const idCliente = _venda.cliente.substr(-2);
            
			
			this.listaClientes[idCliente] ={
				cpf: '',
				nome: '',
				valores: [],
				cliente: idCliente
			};
			
        });

    },

    // listaVinhos: {} tem refazer a lista de vinho por causa que esta sobreescvrevendo obs... pegar por codigo de compra
    populaDadosClientes: async  function () {
        
        let clientes;
        await Clientes.getAll().then(_cliente=>{
            clientes = _cliente;
        });


        this.vendas.map(function (_venda) {
            
            const idCliente = (_venda.cliente.substr(-2));

            this.listaClientes[idCliente] = { 
                cpf: Number(idCliente),
                nome:'n/a',
                valores: [],
                itens: {}

            };

			
		}, this);
        

        listaVinhos = {};
		this.vendas.map( (_venda)=> {
            
            const idCliente = _venda.cliente.substr(-2);
            
            
            this.listaClientes[idCliente].valores.push( _venda.valorTotal);
            
            
            listaVinhos[idCliente] = [];
            // console.log('uuu', idCliente, _venda.valorTotal);
            
            // _venda.itens.map(_vinho=>{

            //     // console.log(999, idCliente, _vinho.produto);
                
            //     listaVinhos[idCliente].push(_vinho.produto);
            // })
            
            this.listaClientes[idCliente].itens = listaVinhos;
            this.listaClientes[idCliente].nome = clientes[Number(idCliente)].nome

        }, this);

        this.vendas.map( (_venda)=> {
            
            const idCliente = _venda.cliente.substr(-2);

            _venda.itens.map(_vinho=>{
                
                listaVinhos[idCliente].push(_vinho.produto);
            })
            
            this.listaClientes[idCliente].itens =  listaVinhos[idCliente];


        }, this);


        // return console.log(listaVinhos);
        

        // return console.log(this.listaClientes);
        
        
    },

    somaTotalByCliente: function () {

        for (const key in this.listaClientes) {
			if (this.listaClientes.hasOwnProperty(key)) {
				let element = this.listaClientes[key];
   
				total = (element.valores.reduce((a,b)=>(a+b)))

                this.listaClientes[key].total = total;
				// this.listaClientes[key] = {
                //     cpf: this.listaClientes[key].cpf,
                //     nome: this.listaClientes[key].nome,
                //     total: total,
                //     itens: this.listaClientes[key].itens,

                    
                // }
				
			}
		}
        
    },

    makeTotalComprasCliente: async function (vendas) {

        this.vendas = vendas;

		this.criarIndicesClientes();
        await this.populaDadosClientes();
        this.somaTotalByCliente();
        
        return Object.values(this.listaClientes);

    }
}
