import { db } from './config'


const addDocument = ( collection, data ) => {
    db.addDoc(db.collection(db.getFirestore(),collection),{
        ...data,
        createdAt: db.serverTimestamp()
    })
}

export { addDocument }