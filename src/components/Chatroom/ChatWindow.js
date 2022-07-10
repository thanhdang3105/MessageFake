import { useContext, useEffect, useMemo, useState, useRef } from 'react';
// import { useLocation } from 'react-router-dom'
import { UserAddOutlined, SendOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip, Form, Alert } from 'antd';
import Message from './Message';
import TextArea from 'antd/lib/input/TextArea';
import { AuthContext } from '../../context/AuthProvider';
import { AppContext } from '../../context/AppProvider';
import InviteMemberModal from '../Modals/InviteMemberModal';
import { useForm } from 'antd/lib/form/Form';
import { addDocument } from '../../firebase/services';
import { db } from '../../firebase/config';
import { useLayoutEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export default function ChatWindow() {
    const user = useContext(AuthContext);
    const { messages, users, setSelectedRoomId, selectedRoomId, members, setIsInviteMember, setIsSettingRoom } =
        useContext(AppContext);
    const [data, setData] = useState(false);
    const [isWork, setIsWork] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const [form] = useForm();
    const listMessage = useRef();

    useEffect(() => {
        if (selectedRoomId.chatId) {
            const check = users.find((item) => {
                return item.uid === selectedRoomId.chatId.find((uid) => uid !== user.uid);
            });
            setIsWork(check.isWork);
        }
    }, [users, selectedRoomId]);

    useLayoutEffect(() => {
        if (selectedRoomId.chatId) {
            selectedRoomId.messages.map((message, index) => {
                if (users && message) {
                    const { photoURL, displayName } = users.find((user) => user.uid === message.uid);
                    message.displayName = displayName;
                    message.photoURL = photoURL;
                    message.id = message.uid + index;
                }
                return message;
            });
            setData(selectedRoomId);
        } else if (selectedRoomId) {
            setData({ ...selectedRoomId, messages, members });
        }
    }, [selectedRoomId, messages]);

    const handleInviteMember = () => {
        setIsInviteMember(true);
    };

    const handleInputChange = (e) => {
        setTextMessage(e.target.value);
    };

    const handleOnSubmit = async () => {
        if (textMessage) {
            if (selectedRoomId.chatId) {
                if (data.messages.length === 0) {
                    const result = await addDocument('chats', {
                        chatId: selectedRoomId.chatId,
                        messages: [
                            {
                                uid: user.uid,
                                text: textMessage,
                                createdAt: Timestamp.now(),
                            },
                        ],
                        backgroundURL: '',
                    });
                    const uid = result.chatId.find((item) => item.uid !== user.uid);
                    const check = users.find((user) => user.uid === uid);
                    if (check) {
                        result.name = check.displayName;
                        result.photoURL = check.photoURL;
                    }
                    setSelectedRoomId(result);
                } else {
                    const chatsRef = db.doc(db.collection(db.getFirestore(), 'chats'), messages[0].id);
                    // const createdAt = db.serverTimestamp()
                    db.updateDoc(chatsRef, {
                        messages: [
                            ...messages[0].messages,
                            {
                                uid: user.uid,
                                text: textMessage,
                                createdAt: Timestamp.now(),
                            },
                        ],
                    });
                }
            } else {
                addDocument('messages', {
                    text: textMessage,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    roomId: selectedRoomId.id,
                });
            }
            form.resetFields(['message']);
            setTextMessage('');
        }
    };

    useEffect(() => {
        if (listMessage.current) {
            listMessage.current.scrollTo({
                top: listMessage.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        }
    });

    return (
        <>
            {data ? (
                <div className="chatWindow">
                    <InviteMemberModal />
                    <div className="header_chat">
                        <div className="header_info">
                            <div className="header_name-wrapper">
                                {data.photoURL && (
                                    <Avatar src={data.photoURL}>
                                        {data.photoURL ? '' : data.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                )}
                                <div className="name_header">
                                    <p className="header_title">
                                        {data.name}{' '}
                                        {selectedRoomId.id && (
                                            <Button
                                                type="text"
                                                icon={<SettingOutlined />}
                                                onClick={() => setIsSettingRoom(true)}
                                                size="small"
                                            />
                                        )}
                                    </p>
                                    <span className="header_description">
                                        {data.description || (isWork ? 'Đang hoạt động' : 'OFFLINE')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="control_header">
                            <Avatar.Group size="small" maxCount={2}>
                                {data.members?.map((member) => (
                                    <Tooltip key={member.id} title={member.displayName}>
                                        <Avatar src={member.photoURL}>
                                            {member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                            {data.members && (
                                <Button
                                    icon={<UserAddOutlined />}
                                    onClick={handleInviteMember}
                                    className="button_addUser"
                                >
                                    Mời
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="content_chat">
                        <ul className="list_message" ref={listMessage}>
                            {data.messages?.map((message) => (
                                <li key={message.id} className={`item_message ${message.uid === user.uid ? 'me' : ''}`}>
                                    <Message
                                        text={message.text}
                                        photoUrl={message.photoURL}
                                        displayName={message.displayName}
                                        createdAt={message.createdAt}
                                    />
                                </li>
                            ))}
                        </ul>
                        <Form form={form} layout="inline" className="form_submit">
                            <Form.Item name="message" className="input_form">
                                <TextArea
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    onPressEnter={handleOnSubmit}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tin nhắn"
                                    autoComplete="off"
                                />
                                <Button
                                    type="text"
                                    className="btn_submit"
                                    onClick={handleOnSubmit}
                                    icon={<SendOutlined />}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            ) : (
                <Alert type="info" message="Bạn chưa có phòng chat nào !" showIcon />
            )}
        </>
    );
}
