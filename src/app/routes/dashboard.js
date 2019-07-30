module.exports = routes => {

    let db_receber = routes.src.config.firebaseConfig.collection('receber');
    let db_total = routes.src.config.firebaseConfig.collection('gastos');


    routes.get('/dash/:date', async (req, res) => {
        const { date } = req.params;
        try {
            let docs_receber = await db_receber.get();
            let receber = [];
            docs_receber.forEach(item => {
                receber.push(extratorDeValores(item, date, "receber"))
            });
            let totalReceber = receber.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalReceber = totalReceber.toLocaleString('pt-br', { minimumFractionDigits: 2 });

            let docs_gastos = await db_total.get();
            let gastos = [];
            docs_gastos.forEach(item => {
                gastos.push(extratorDeValores(item, date, "gastos"))
            });
            let totalGastos = gastos.reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual));
            let convTotalGastos = totalGastos.toLocaleString('pt-br', { minimumFractionDigits: 2 });
            let sobra = parseFloat(totalReceber) - parseFloat(totalGastos)

            return res.send({ totalGasto: convTotalGastos, aReceber: convTotalReceber, restou: sobra.toFixed(2) })
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    })


    extratorDeValores = (valores, date, tipo) => {
        let v = valores.data();
        /*  console.log(v) */
        let mes = null;
        let ano = null;

        console.log("aqui")
        mes = parseInt(date.split('-')[0]);
        ano = parseInt(date.split('-')[1]);

        /**
         * Quebrar a data de lançamento...
         * para pegar mes e ano
         * pode ser legal já deixar configurado para dia também
         */

        if (v.mes === mes && v.ano === ano) {
            
            return (v.valor)
        }
        else return (0)
    }
}