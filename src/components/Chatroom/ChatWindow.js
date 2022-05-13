import { useContext, useEffect, useMemo, useState, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
import { UserAddOutlined, SendOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons'
import { Avatar, Button, Tooltip, Form, Alert } from 'antd'
import Message from './Message'
import TextArea from 'antd/lib/input/TextArea'
import { AuthContext } from '../../context/AuthProvider'
import { AppContext } from '../../context/AppProvider'
import InviteMemberModal from '../Modals/InviteMemberModal'
import { useForm } from 'antd/lib/form/Form'
import { addDocument } from '../../firebase/services'
import useFirestore from '../../hooks/useFirestore'

export default function ChatWindow({showSlideBar}) {
    const user = useContext(AuthContext)
    const { selectedRoomId, members, setIsInviteMember, setIsSettingRoom } = useContext(AppContext)
    const [textMessage, setTextMessage] = useState('')
    const [form] = useForm()
    const listMessage = useRef()

    const handleInviteMember = () => {
        setIsInviteMember(true)
    }

    const handleInputChange = (e) => {
        setTextMessage(e.target.value)
    }

    const handleOnSubmit = () => {
        if(textMessage){
            addDocument('messages',{
                text: textMessage,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                roomId: selectedRoomId.id
            })
            form.resetFields(['message'])
            setTextMessage('')
        }
    }

    const messageCondition = useMemo(() => {
        return {
          fieldName: 'roomId',
          operator: '==',
          compareValue: selectedRoomId?.id
        }
      }, [selectedRoomId])
    
    const messages = useFirestore('messages',messageCondition,'asc')

    useEffect(() => {
        if(listMessage.current){
            listMessage.current.scrollTop = listMessage.current.scrollHeight
        }
    }, [messages])

    const handleVisibleMobileSlider = () => {
        showSlideBar(true)
    }
    
  return (
    <>
    {selectedRoomId ? (
        <div className='chatWindow'>
            <InviteMemberModal/>
            <div className="header_chat">
                <div className='header_info'>
                <Button ghost icon={<MenuOutlined/>} onClick={handleVisibleMobileSlider} className="mobileSlider"/>
                <div className="name_header">
                    <p className='header_title'>{selectedRoomId.name}
                       {' '} <Button type='text' icon={<SettingOutlined/>} onClick={() => setIsSettingRoom(true)} size='small'/>
                    </p>
                    <span className='header_description'>{selectedRoomId.description}</span>
                </div>
                </div>
                <div className="control_header">
                    <Avatar.Group size='small' maxCount={2}>
                        {members.map(member => (
                            <Tooltip key={member.id} title={member.displayName}>
                                <Avatar src={member.photoURL}>{member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                    {<Button icon={<UserAddOutlined/>} onClick={handleInviteMember} className="button_addUser">Mời</Button>}
                </div>
            </div>
            <div className="content_chat">
                <ul className="list_message" ref={listMessage}>
                    {messages.map(message => (
                        <li key={message.id} className={`item_message ${message.uid === user.uid ? 'me' : ''}`}>
                            <Message text={message.text} photoUrl={message.photoURL} displayName={message.displayName} createdAt={message.createdAt} />
                        </li>
                    ))}
                </ul>
                <Form form={form} layout="inline" className="form_submit">
                    <Form.Item name='message' className="input_form">
                        <TextArea autoSize={{ minRows: 1, maxRows: 6 }} onChange={handleInputChange} placeholder="Nhập tin nhắn" autoComplete="off" />
                    </Form.Item>
                    <Button onClick={handleOnSubmit} icon={<SendOutlined/>}/>
                </Form>
            </div>
        </div>
    ) : <Alert type='info' message='Bạn chưa có phòng chat nào !' showIcon />}
    </>
  )
}
