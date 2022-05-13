import { Collapse, Typography, Button } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons'
import { AppContext } from '../../context/AppProvider'
import { useContext, useEffect } from 'react'
import AddRoomModal from '../Modals/AddRoomModal'

const { Panel } = Collapse


export default function Roomlist() {

  const { rooms, setIsAddRoom, setSelectedRoomId} = useContext(AppContext)

  useEffect(() => {
    if(rooms?.length > 0) {
      setSelectedRoomId(rooms[0])
    }
    else{
      setSelectedRoomId('')
    }
  }, [rooms,setSelectedRoomId])

  const handleAddRoom = () => {
    setIsAddRoom(true)
  }

  return (
    <Collapse className="div_collapse" ghost defaultActiveKey={['Panel-1']}>
        <Panel className="div_panel" header="Danh sách các phòng" key='Panel-1'>
            <div className="list_room">
              {rooms.map((room,index) => (
                  <Typography.Link key={index} onClick={() => setSelectedRoomId(room)} className="link_room">{room.name}</Typography.Link>
              ))}
            </div>
            <Button type="text" icon={<PlusSquareOutlined/>} className="add_room" onClick={handleAddRoom}>Thêm phòng</Button>
        </Panel>
        <AddRoomModal/>
    </Collapse>
  )
}
