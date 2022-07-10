import { createContext, useContext, useMemo, useState } from 'react';
import { AuthContext } from './AuthProvider';
import useFirestore from '../hooks/useFirestore';

export const AppContext = createContext();

function AppProvider({ children }) {
    const [isAddRoom, setIsAddRoom] = useState(false);
    const [isInviteMember, setIsInviteMember] = useState(false);
    const [isSettingRoom, setIsSettingRoom] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(false);

    const user = useContext(AuthContext);

    //   documents rooms {
    //     name: 'room name',
    //     description: 'mo ta',
    //     members:[uid1,ui2,...]
    //   }

    const messageCondition = useMemo(() => {
        return [
            'messages',
            {
                fieldName: 'roomId',
                operator: '==',
                compareValue: selectedRoomId?.id,
            },
            'asc',
        ];
    }, [selectedRoomId]);

    const messages = useFirestore(...messageCondition);

    // useEffect(() => {
    //   if(selectedRoomId.user){
    //     const ref = query(db.collection(db.getFirestore(),'chats'),where('chatId','in',[selectedRoomId.user.map(user => user.uid)]))
    //     getDocs(ref).then(snapshot => {
    //       const docs = snapshot.docs.map(doc => doc.data())
    //       setMessages(docs)
    //     })
    //   }else{
    //     const ref = query(db.collection(db.getFirestore(),'messages'),where('roomId','==',selectedRoomId?.id,db.orderBy('createdAt','asc')))
    //     getDocs(ref).then(snapshot => {
    //       const docs = snapshot.docs.map(doc => ({...doc.data(),id:doc.id}))
    //       setMessages(docs)
    //     })
    //   }
    // },[selectedRoomId])
    const chatsCondition = useMemo(() => {
        return {
            fieldName: 'chatId',
            operator: 'array-contains',
            compareValue: user.uid,
        };
    }, [user.uid]);

    const chats = useFirestore('chats', chatsCondition);

    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: user.uid,
        };
    }, [user.uid]);

    const rooms = useFirestore('rooms', roomsCondition);

    // const roomSelected = rooms.find(room => {
    //   return room.id === selectedRoomId
    // })

    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoomId?.members,
        };
    }, [selectedRoomId]);

    const users = useFirestore('users');

    const members = useFirestore('users', usersCondition);

    return (
        <AppContext.Provider
            value={{
                users,
                rooms,
                chats,
                isAddRoom,
                setIsAddRoom,
                selectedRoomId,
                setSelectedRoomId,
                members,
                isInviteMember,
                setIsInviteMember,
                isSettingRoom,
                setIsSettingRoom,
                messages,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
