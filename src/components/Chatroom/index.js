import { Row, Col } from 'antd'
import Sildebar from './Sildebar'
import ChatWindow from './ChatWindow'
import { AppContext } from '../../context/AppProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import { SettingRoom } from '../Modals/SettingRoom'

function ChatRoom() {
    const [backgroundURL, setBackgroundURL] = useState(() => {
        if(localStorage.backgroundURL){
            return JSON.parse(window.localStorage.backgroundURL)
        }
        return ''
    })

    const [isVisibleSlideMoblie,setIsVisibleSlideMoblie] = useState(false)
    
    const { selectedRoomId } = useContext(AppContext)

    const appRef = useRef()
  
    useEffect(() => {
      const app = appRef.current
      const check = backgroundURL.find(item => item.roomId === selectedRoomId.id)
      if(check){
          app.style.backgroundImage = `url('/img/${check.url}')`
      }
      else{
        app.style.backgroundImage = `unset`
      }
    }, [backgroundURL,selectedRoomId])
    return (
        <>
            <SettingRoom setBackgroundURL={setBackgroundURL} />
            <Row ref={appRef} className='App_row'>
                <Col xs={0} sm={0} md={5} xl={5} className={`Col_slidebar ${isVisibleSlideMoblie && 'show'}`}><Sildebar 
                showSlideBar={{isVisibleSlideMoblie,setIsVisibleSlideMoblie}}/></Col>
                <Col xs={24} sm={24} md={19} xl={19}><ChatWindow showSlideBar={setIsVisibleSlideMoblie}/></Col>
            </Row>
        </>
    )
}

export default ChatRoom;
