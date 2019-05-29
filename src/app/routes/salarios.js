module.exports = routes => {

    const db = routes.src.config.firebaseConfig.collection('salarios');

    routes.get('/salarios', async (req, res) => {
        try {
            let docs = await db.get();
            let salarios = [];

            docs.forEach(salario => {
                salarios.push(extractSalarios(salario))
            })
            return res.send(salarios)
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    });
    routes.put('/salarios/:id', async (req, res) => {
        try {

            await db.doc(req.params.id).update(req.body);
            return res.send(`Salario ${req.params.id} foi atualizado com sucesso`)
        } catch (error) {
            console.log(error);
            return res.status(500).send('Erro no servidor')
        }
    });

    extractSalarios = salario => {
        let v = salario.data();
        return {
            id: salario.id,
            salarioLeandro: v.SLeandro,
            salarioSamira: v.SSamira
        }
    }
}