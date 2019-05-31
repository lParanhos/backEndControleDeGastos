module.exports = routes => {

    let db_receber = routes.src.config.firebaseConfig.collection('receber');
    let db_total = routes.src.config.firebaseConfig.collection('gastos');


    routes.get('/dash', async (req, res) => {

        try {
            let docs_receber = await db_receber.get();
            let receber = [];
            docs_receber.forEach(item => {
                receber.push(extratorDeValores(item))
            });
            let totalReceber = receber.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalReceber = totalReceber.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

            let docs_gastos = await db_total.get();
            let gastos = [];
            docs_gastos.forEach(item => {
                gastos.push(extratorDeValores(item))
            });
            let totalGastos = gastos.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalGastos = totalGastos.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });


            return res.json({ totalGasto: convTotalGastos, aReceber: convTotalReceber })
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    })


    extratorDeValores = valores => {
        let v = valores.data();
        return (v.Valor)
    }
}