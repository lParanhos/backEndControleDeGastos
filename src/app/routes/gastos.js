module.exports = routes => {

    const db = routes.src.config.firebaseConfig.collection('gastos')

    //Pega todos os registros
    routes.get('/gastos', async (req, res) => {
        try {
            let docs = await db.get();
            let gastos = [];
            docs.forEach(gasto => {
                gastos.push(extractGastos(gasto))
            });
            // console.log(gastos)
            return res.send(gastos)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    });

    //Pega um registro especifico
    routes.get('/gastos/:id', async (req, res) => {
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
        try {
            let result = await db.add(req.body);

            return res.send(result.id)
        } catch (error) {
            return res.status(500).send(error);
        }
    });

    //Edita um registro
    routes.put('/gastos/:id', async (req, res) => {
        try {
            await db.doc(req.params.id).update(req.body)
            return res.send(`Registro ${req.params.id} foi atualizado com sucesso`)
        }
        catch (error) {
            return res.status(500).send(error)
        }
    })
    //Deleta um registro
    routes.delete('/gastos/:id', async (req, res) => {
        console.log('Fui chamado')
        try {
            await db.doc(req.params.id).delete()
            return res.send(`A vaga ${req.params.id} foi removida com sucesso`)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    })

    extractGastos = gasto => {
        let v = gasto.data();
        console.log("=>", v.data)
        return {
            id: gasto.id,
            valor: v.valor,
            local: v.local,
            data: `${v.dia}/${v.mes}/${v.ano}`,
            //parcela: v.Parcelado,
        }
    }
}