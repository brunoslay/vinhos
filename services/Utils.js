module.exports =  Utils = {
    listaIndices: {},
	makeListaIndice: function (arrayDeObjetos, indice) {

		arrayDeObjetos.map(obj=>{
			this.listaIndices[obj[indice]] = obj;
		}, this);
		
		return this.listaIndices;
    },
    orderByDesc: function (arrayDeObjetos, indicador){
        return arrayDeObjetos.sort((a,b)=>(b[indicador]-a[indicador]));
    },
    orderByAsc: function (arrayDeObjetos, indicador){
        return arrayDeObjetos.sort((a,b)=>(a[indicador]-b[indicador]));
    }
}