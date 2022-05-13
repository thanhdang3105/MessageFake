import { useEffect,useState } from 'react'
import { db } from '../firebase/config'

const useFirestore = (collection, condition, sort = 'desc') => {

    const [documents,setDocuments] = useState([])

    useEffect(() => {

        let collectionRef = db.collection(db.getFirestore(), collection)
        collectionRef = db.query(collectionRef, db.orderBy('createdAt', sort))
        if (condition && condition.compareValue && condition.compareValue.length) {
            collectionRef = db.query(collectionRef, db.where(condition.fieldName, condition.operator, condition.compareValue))
        }

        const unsubscribe = db.onSnapshot(collectionRef, (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setDocuments(documents)
        })
        return unsubscribe
    }, [collection, condition, sort])
    return documents
}

export default useFirestore