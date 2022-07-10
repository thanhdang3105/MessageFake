import { doc, getDoc } from 'firebase/firestore'
import { db } from './config'


const addDocument = async ( collection, data ) => {
    const result = await db.addDoc(db.collection(db.getFirestore(),collection),{
        ...data,
        createdAt: db.serverTimestamp()
    })
    return {...(await getDoc(result)).data(),id: result.id}
}

export { addDocument }