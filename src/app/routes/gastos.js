module.exports = routes => {

    const db = routes.src.config.firebaseConfig.collection('gastos')

    //Pega todos os registros
    routes.get('/gastos/:date', async (req, res) => {
        let { date } = req.params;
        console.log("ola")
        try {
            let docs = await db.get();
            let gastos = [];
            docs.forEach(gasto => {
                gastos.push(extractGastos(gasto, date))
            });
            //Remove o gasto null caso tenha
            gastos = gastos.filter(gasto => gasto != null)
            // console.log(gastos)
            return res.send(gastos)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    });

    //Pega um registro especifico
    routes.get('/gasto/:id', async (req, res) => {
        try {
            const id = req.params.id;

            let gasto = await db.doc(id).get();

            if (gasto.exists)
                return res.send(extractGastos(gasto))
            else
                return res.status(404).send('Gasto não encontrado')
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)

        }
    })
    //Adiciona um registro
    routes.post('/gastos', async (req, res) => {
        const { mes, ano, qtdParcelas } = req.body;
        console.log("body => ", req.body);
        let newRangeMouths = [];
        for (let i = 0; i < (qtdParcelas ? qtdParcelas : 1); i++) {
            if (mes + i > 12) newRangeMouths.push(`${(mes + i) - 12}/${ano + 1}`);
            else newRangeMouths.push(`${mes + i}/${ano}`);
        }
        let newSubmit = { ...req.body, parcelas: newRangeMouths }
        try {
             let result = await db.add(newSubmit);

            return res.send(result)
        } catch (error) {
            return res.status(500).send(error);
        }
    });

    //Edita um registro
    routes.put('/gasto/:id', async (req, res) => {
        try {
            await db.doc(req.params.id).update(req.body)
            return res.send(`Registro ${req.params.id} foi atualizado com sucesso`)
        }
        catch (error) {
            return res.status(500).send(error)
        }
    })
    //Deleta um registro
    routes.delete('/gasto/:id', async (req, res) => {
        console.log('Fui chamado')
        try {
            await db.doc(req.params.id).delete()
            return res.send(`A vaga ${req.params.id} foi removida com sucesso`)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    })

    extractGastos = (gasto, date) => {
        let v = gasto.data();
        if (date) {
            let mes = parseInt(date.split('-')[0]);
            let ano = parseInt(date.split('-')[1]);
            let aux = date.replace("-", "/")
            if (v.parcelado) {
                if (v.parcelas.includes(aux) /* && v.ano === ano */) {
                    let nParcela = v.parcelas.indexOf(aux) + 1;
                    return {
                        id: gasto.id,
                        valor: v.valor,
                        local: v.local,
                        vencimento: `${v.dia}/${mes}/${ano}`,
                        parcela: `${nParcela}/${v.parcelas.length}`,
                        lancamento: v.dataLancamento
                    }
                }
            } else if (v.dataLancamento.includes(`${mes}/${ano}`)) {
                return {
                    id: gasto.id,
                    valor: v.valor,
                    local: v.local,
                    vencimento: `${v.dia}/${v.mes}/${v.ano}`,
                    lancamento: v.dataLancamento ? v.dataLancamento : `${v.dia}/${v.mes}/${v.ano}`,
                }
            }
        } else {
            return {
                id: gasto.id,
                valor: v.valor,
                local: v.local,
                data: `${v.dia}/${v.mes}/${v.ano}`,
                //parcela: v.Parcelado,
            }
        }
    }

}