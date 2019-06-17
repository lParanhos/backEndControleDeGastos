module.exports = routes => {

    const db = routes.src.config.firebaseConfig.collection('receber');

    routes.get('/receber', async (req, res) => {
        try {
            let docs = await db.get();
            let salarios = [];

            docs.forEach(salario => {
                salarios.push(extractDados(salario))
            })
            return res.send(salarios)
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    });
    routes.put('/receber/:id', async (req, res) => {
        try {

            await db.doc(req.params.id).update(req.body);
            return res.send(`Salario ${req.params.id} foi atualizado com sucesso`)
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    });

    routes.post('/receber', async (req, res) => {
        try {
            let result = await db.add(req.body);

            return res.send(result.id)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Erro no servidor")
        }
    })

    routes.delete('/receber/:id', async (req, res) => {
        try {
            await db.doc(req.params.id).delete()
            return res.send(`A vaga ${req.params.id} foi removida com sucesso`)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    })

    extractDados = salario => {
        let v = salario.data();
        return {
            id: salario.id,
            de: v.De,
            valor: v.Valor,
            quandoReceber: v.quando,
            recebido: v.recebido
        }
    }
}