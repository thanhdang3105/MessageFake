import { Button, Form, Image, Modal } from 'antd'
import React from 'react'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import { db } from '../../firebase/config'
import { imageFiles } from '../../hooks/readFile'


export function SettingRoom({setBackgroundURL}) {
    const { isSettingRoom, setIsSettingRoom, selectedRoomId } = React.useContext(AppContext)
    const user = React.useContext(AuthContext)

    const [isSetBackground, setIsSetBackground] = React.useState(false)

    const handleOutRoom = () => {
        const roomRef = db.doc(db.collection(db.getFirestore(),'rooms'),selectedRoomId.id)
        const arr = selectedRoomId.members.filter(member => member !== user.uid)
        if(selectedRoomId.members.length === 1){
            db.deleteDoc(roomRef)
        }
        else{
            db.updateDoc(roomRef,{
                members: arr
            })
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
        const roomRef = db.doc(db.collection(db.getFirestore(),'rooms'),selectedRoomId.id)
        db.updateDoc(roomRef,{
            backgroundURL: img
        })
        setValue([])
        setIsInviteMember(false)
    }
  return (
    <div>
        <Modal title={isSetBackground ? 'Hình nền' : 'Cài đặt'} visible={isSettingRoom} onOk={handleOk} onCancel={handleCancel}>
            {isSetBackground ? (
                    <ul className='setBackground_group'>
                        {imageFiles.map((img,index) => (
                            <li key={index} className="setBackground_imageBox">
                                <Image className='setBackground_image' onClick={() => handleSetBackground(img)} preview={false} src={`/img/${img}`}/>
                            </li>
                        ))}
                    </ul>
            ) : (
                <Form layout='vertical'>
                    <Form.Item>
                        <Button onClick={() => setIsSetBackground(true)}>Đổi hình nền</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleOutRoom} danger>Thoát phòng</Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    </div>
  )
}
