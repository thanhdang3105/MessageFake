import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'
import {
  AuthContext
} from './AuthProvider'
import useFirestore from '../hooks/useFirestore'

export const AppContext = createContext()

function AppProvider({ children }) {

  const [isAddRoom, setIsAddRoom] = useState(false)
  const [isInviteMember, setIsInviteMember] = useState(false)
  const [isSettingRoom, setIsSettingRoom] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState('')

  const user = useContext(AuthContext)
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: user.uid
    }
  }, [user.uid])

  //   documents rooms {
  //     name: 'room name',
  //     description: 'mo ta',
  //     members:[uid1,ui2,...]
  //   }

  const rooms = useFirestore('rooms', roomsCondition)


  // const roomSelected = rooms.find(room => {
  //   return room.id === selectedRoomId
  // })

  const usersCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoomId?.members
    }
  }, [selectedRoomId])

  const users = useFirestore('users')

  const members = useFirestore('users', usersCondition)

  return ( <AppContext.Provider value = {
      {
        users,
        rooms,
        isAddRoom,
        setIsAddRoom,
        selectedRoomId,
        setSelectedRoomId,
        members,
        isInviteMember,
        setIsInviteMember,
        isSettingRoom,
        setIsSettingRoom
      }
    } > {
      children
    } </AppContext.Provider>
  )
}

export default AppProvider
