import { Button, Form, Input, message, Modal } from 'antd'
import React from 'react'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import { db } from '../../firebase/config'
import { addDocument } from '../../firebase/services'
import useFirestore from '../../hooks/useFirestore'

export default function AddRoomModal() {
    const { isAddRoom, setIsAddRoom, setSelectedRoomId } = React.useContext(AppContext)
    const user = React.useContext(AuthContext)
    const [isCreate,setIsCreate] = React.useState(false)
    const [form] = Form.useForm()
    const rooms = useFirestore('rooms')

    const handleOk = async () => {
        if(isCreate) {
            const result = await addDocument('rooms',{...form.getFieldValue(), backgroundURL: '', members: [user.uid]})
            message.success({
                content: 'Tạo phòng thành công',
                key: 'addRoom',
                duration: 2
            })
            console.log(result)
            setSelectedRoomId(result)
            setIsAddRoom(false)
        }else {
            const room = rooms.find(room => room.id === form.getFieldValue(['id']))
            if(room) {
                if(!room.members.includes(user.uid)){
                    const roomRef = db.doc(db.collection(db.getFirestore(),'rooms'),room.id)
                    db.updateDoc(roomRef,{
                        members: [...room.members,user.uid]
                    })
                    room.members = [...room.members,user.uid]
                    setSelectedRoomId(room)
                }else{
                    message.info({
                        content: 'Bạn đã có mặt trong phòng này.',
                        key: 'addRoom',
                        duration: 2
                    })
                    setSelectedRoomId(room)
                }
                setIsAddRoom(false)
            }else{
                message.error({
                    content: 'Phòng này không tồn tại!',
                    key: 'addRoom',
                    duration: 2
                })
            }
        }
        form.resetFields()
    }

    const handleCancel = () => {
        setIsAddRoom(false)
    }
  return (
    <div>
        <Modal title={isCreate ? "Tạo phòng" : 'Nhập Id phòng'} visible={isAddRoom} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form} layout='vertical'>
                {isCreate ? (
                    <>
                        <Form.Item label='Tên phòng' name='name'>
                            <Input placeholder='Nhập tên phòng...'/>
                        </Form.Item>
                        <Form.Item label='Mô tả' name='description'>
                            <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder='Nhập mô tả'/>
                        </Form.Item>
                        <Button type='text' size='small' onClick={() => setIsCreate(false)}>Vào phòng</Button>
                    </>
                ): (
                    <>
                        <Form.Item label='ID phòng' name='id'>
                            <Input placeholder='Nhập id phòng...' onPressEnter={handleOk}/>
                        </Form.Item>
                        <Button type='text' size='small' onClick={() => setIsCreate(true)}>Tạo phòng</Button>
                    </>
                    )}
            </Form>
        </Modal>
    </div>
  )
}
