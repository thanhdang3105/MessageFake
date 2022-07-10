import { Collapse, Typography, Button, Input, Dropdown, Menu, Spin, Avatar } from 'antd';
import { PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { AppContext } from '../../context/AppProvider';
import { useContext, useEffect, useRef, useState } from 'react';
import AddRoomModal from '../Modals/AddRoomModal';
import { AuthContext } from '../../context/AuthProvider';
import { getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const { Panel } = Collapse;

const spin = <Spin style={{ width: '100%', textAlign: 'center' }} />;

export default function Roomlist({ setSlideMobile }) {
    const user = useContext(AuthContext);
    const { users, rooms, chats, setIsAddRoom, setSelectedRoomId, selectedRoomId } = useContext(AppContext);
    const [itemSearch, setItemSearch] = useState([{ key: 'loading', label: spin }]);
    const [search, setSearch] = useState('');
    const [chatList, setChatList] = useState(false);
    const [visible, setVisible] = useState(false);

    const refTimeOut = useRef();

    window.onclose = async (a, e) => {
        // e.preventDefault();
        const snapshot = await getDocs(
            db.query(db.collection(db.getFirestore(), 'users'), db.where('uid', '==', user.uid)),
        );
        const arr = [];
        for (const doc of snapshot.docs) {
            arr.push(
                await updateDoc(doc.ref, {
                    isWork: false,
                }),
            );
        }
        return arr;
    };

    window.onbeforeunload = (e) => {
        e.preventDefault();
        getDocs(db.query(db.collection(db.getFirestore(), 'users'), db.where('uid', '==', user.uid))).then(
            (snapshot) => {
                snapshot.docs.map((doc) => {
                    updateDoc(doc.ref, {
                        isWork: false,
                    }).then(() => {});
                });
            },
        );
        e.returnValue = 'cho ti';
    };

    useEffect(() => {
        if (!selectedRoomId && chatList && chatList.length > 0) {
            setSelectedRoomId(chatList[0]);
        } else if (!selectedRoomId && rooms?.length > 0) {
            setSelectedRoomId(rooms[0]);
        }
    }, [rooms, setSelectedRoomId, chatList, selectedRoomId]);

    const handleAddRoom = () => {
        setIsAddRoom(true);
    };

    useEffect(() => {
        const arrchats =
            chats.length &&
            user &&
            chats.map((chat) => {
                const uid = chat.chatId.find((item) => item.uid !== user.uid);
                const check = users.find((user) => user.uid === uid);
                if (check) {
                    chat.name = check.displayName;
                    chat.photoURL = check.photoURL;
                    chat.isWork = check.isWork;
                }
                return chat;
            });
        if (arrchats) {
            setChatList(arrchats);
        } else {
            setChatList(false);
        }
    }, [chats, user, users]);

    const handleSearchFriend = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value) {
            setVisible(true);
            if (refTimeOut.current) {
                clearTimeout(refTimeOut.current);
            }
            const userFilterd = users.filter((item) => {
                return item.displayName.toLowerCase().includes(e.target.value.toLowerCase()) && item.uid !== user.uid;
            });
            const newItems = userFilterd.map((item) => {
                return {
                    key: item.uid,
                    label: (
                        <>
                            <Avatar src={item.photoURL}>
                                {item.photoURL ? '' : item.displayName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography.Text>{item.displayName}</Typography.Text>
                        </>
                    ),
                };
            });
            setItemSearch(newItems);
            if (!newItems.length) {
                setItemSearch([{ key: 'loading', label: spin }]);
                refTimeOut.current = setTimeout(() => {
                    setVisible(false);
                }, 1500);
            }
        } else {
            setVisible(false);
            setItemSearch([{ key: 'loading', label: spin }]);
        }
    };

    const handleClickUser = (value) => {
        const userFind = users.find((user) => user.uid === value.key);
        const check = chats.find((chat) => chat.chatId.includes(value.key) && chat.chatId.includes(user.uid));
        if (check) {
            setSelectedRoomId(check);
        } else {
            setSelectedRoomId({
                name: userFind.displayName,
                photoURL: userFind.photoURL,
                chatId: [userFind.uid, user.uid],
                isWork: userFind.isWork,
                messages: [],
                backgroundURL: '',
            });
        }
        setSlideMobile(false);
        setSearch('');
        setVisible(false);
        setItemSearch([{ key: 'loading', label: spin }]);
    };

    return (
        <>
            <Dropdown
                visible={visible}
                overlay={<Menu onClick={handleClickUser} items={itemSearch} />}
                trigger={['click']}
            >
                <div className="box_input-search">
                    <Input
                        placeholder="Tìm kiếm..."
                        onChange={handleSearchFriend}
                        value={search}
                        prefix={<SearchOutlined />}
                        className="input-search"
                    />
                </div>
            </Dropdown>
            <Collapse className="div_collapse" ghost defaultActiveKey={['Panel-1', 'Panel-2']}>
                <Panel className="div_panel" header="Các đoạn chat" key="Panel-1">
                    <div className="list_room">
                        {chatList &&
                            chatList.map((chat, index) => (
                                <Typography.Link
                                    key={index}
                                    onClick={() => {
                                        setSlideMobile(false);
                                        setSelectedRoomId(chat);
                                    }}
                                    className="link_room"
                                >
                                    <Avatar src={chat.photoURL}>
                                        {chat.photoURL ? '' : chat.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    {chat.name}
                                </Typography.Link>
                            ))}
                    </div>
                </Panel>
                <Panel className="div_panel" header="Danh sách các phòng" key="Panel-2">
                    <div className="list_room">
                        {rooms.map((room, index) => (
                            <Typography.Link
                                key={index}
                                onClick={() => {
                                    setSlideMobile(false);
                                    setSelectedRoomId(room);
                                }}
                                className="link_room"
                            >
                                {room.name}
                            </Typography.Link>
                        ))}
                    </div>
                    <Button type="link" icon={<PlusSquareOutlined />} className="add_room" onClick={handleAddRoom}>
                        Thêm phòng
                    </Button>
                </Panel>
                <AddRoomModal />
            </Collapse>
        </>
    );
}
