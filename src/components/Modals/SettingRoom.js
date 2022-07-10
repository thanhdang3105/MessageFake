import { CopyOutlined } from '@ant-design/icons'
import { Button, Form, Image, message, Modal } from 'antd'
import confirm from 'antd/lib/modal/confirm'
import React from 'react'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import { db } from '../../firebase/config'
import { imageFiles } from '../../hooks/readFile'


export function SettingRoom() {
    const { isSettingRoom, setIsSettingRoom,setSelectedRoomId, selectedRoomId } = React.useContext(AppContext)
    const user = React.useContext(AuthContext)

    const [isSetBackground, setIsSetBackground] = React.useState(false)

    const handleOutRoom = () => {
        if(selectedRoomId.chatId){
            const Ref = db.doc(db.collection(db.getFirestore(),'chats'),selectedRoomId.id)
            confirm({
                content: 'Bạn có chắc muốn xoá cuộc hội thoại này!',
                onOk: () => {
                    db.deleteDoc(Ref).then(() => {
                        setSelectedRoomId(false)
                        setIsSettingRoom(false)
                    }).catch(err => console.log(err))
                },
            })
            
        }else{
            const Ref = db.doc(db.collection(db.getFirestore(),'rooms'),selectedRoomId.id)
            const arr = selectedRoomId.members.filter(member => member !== user.uid)
            if(selectedRoomId.members.length === 1){
                db.deleteDoc(Ref)
                setSelectedRoomId(false)
            }
            else{
                db.updateDoc(Ref,{
                    members: arr
                })
                setSelectedRoomId(false)
            }
            setIsSettingRoom(false)
        }
    }

    const handleOk = () => {
        setIsSettingRoom(false)
        setIsSetBackground(false)
    }

    const handleCancel = () => {
        if(isSetBackground){
            setIsSetBackground(false)
        }
        else{
            setIsSettingRoom(false)
        }
    }

    const handleSetBackground = (img) => {
        let collec
        if(selectedRoomId.chatId){
            collec = 'chats'
        }else{
            collec = 'rooms'
        }
        db.updateDoc(db.doc(db.collection(db.getFirestore(),collec),selectedRoomId.id),{
            backgroundURL: img
        }).catch(err => console.log(err))
        setSelectedRoomId(prev => ({...prev,backgroundURL: img}))
    }
  return (
    <div>
        <Modal title={isSetBackground ? 'Hình nền' : 'Cài đặt'} visible={isSettingRoom} onOk={handleOk} onCancel={handleCancel}>
            {isSetBackground ? (
                    <ul className='setBackground_group'>
                        {imageFiles.map((img,index) => (
                            <li key={index} className="setBackground_imageBox">
                                <Image className='setBackground_image' onClick={() => handleSetBackground(img)} preview={false} src={`${process.env.PUBLIC_URL}/img/${img}`}/>
                            </li>
                        ))}
                    </ul>
            ) : (
                <Form layout='vertical'>
                    {!selectedRoomId.chatId && (
                        <Form.Item>
                    ID phòng: {selectedRoomId.id} <Button icon={<CopyOutlined/>} type="link" onClick={() => {
                        navigator.clipboard.writeText(selectedRoomId.id).then(() => (
                            message.success({
                                content: 'Đã sao chép dữ liệu.',
                                key: 'copyId',
                                duration: 1
                            })
                        ))
                        .catch(() => message.warning({
                            content: 'Sao chép không thành công.',
                            key: 'copyId',
                            duration: 1
                        }))
                    }} />
                    </Form.Item>
                    )}
                    <Form.Item>
                        <Button onClick={() => setIsSetBackground(true)}>Đổi hình nền</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleOutRoom} danger>{selectedRoomId.chatId ? 'Xoá tin nhắn':'Thoát phòng'}</Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    </div>
  )
}
