const admin = require('firebase-admin')

let serviceAccount = require('./firebaseKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

module.exports = db