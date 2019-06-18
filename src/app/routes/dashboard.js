module.exports = routes => {

    let db_receber = routes.src.config.firebaseConfig.collection('receber');
    let db_total = routes.src.config.firebaseConfig.collection('gastos');


    routes.get('/dash/:data', async (req, res) => {
        const { data } = req.params;
        try {
            let docs_receber = await db_receber.get();
            let receber = [];
            docs_receber.forEach(item => {
                receber.push(extratorDeValores(item, data))
            });
            let totalReceber = receber.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalReceber = totalReceber.toLocaleString('pt-br', { minimumFractionDigits: 2 });

            let docs_gastos = await db_total.get();
            let gastos = [];
            docs_gastos.forEach(item => {
                gastos.push(extratorDeValores(item, data))
            });
            let totalGastos = gastos.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalGastos = totalGastos.toLocaleString('pt-br', { minimumFractionDigits: 2 });


            return res.send({ totalGasto: convTotalGastos, aReceber: convTotalReceber })
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    })


    extratorDeValores = (valores, data) => {
        let v = valores.data();
        let mes = parseInt(data.split('-')[0]);
        let ano = parseInt(data.split('-')[1]);
        console.log(v.mes === mes && v.ano === ano)
        if (v.mes === mes && v.ano === ano) {
            console.log(typeof (v.valor))
            return (v.valor)
        }
        else return (0)
    }
}