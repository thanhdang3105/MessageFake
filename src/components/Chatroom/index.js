import { Row, Col } from 'antd';
import Sildebar from './Sildebar';
import ChatWindow from './ChatWindow';
import { AppContext } from '../../context/AppProvider';
import { useContext, useEffect, useRef, useState } from 'react';
import { SettingRoom } from '../Modals/SettingRoom';

function ChatRoom() {
    const [isVisibleSlideMoblie, setIsVisibleSlideMoblie] = useState(false);

    const { selectedRoomId } = useContext(AppContext);

    const appRef = useRef();

    useEffect(() => {
        const app = appRef.current;
        app.style.backgroundImage = `url('${process.env.PUBLIC_URL}/img/${selectedRoomId.backgroundURL}')`;
    }, [selectedRoomId]);
    return (
        <>
            <SettingRoom />
            <Row ref={appRef} className="App_row">
                <Col xs={0} sm={0} md={5} xl={5} className={`Col_slidebar ${isVisibleSlideMoblie && 'show'}`}>
                    <Sildebar showSlideBar={{ isVisibleSlideMoblie, setIsVisibleSlideMoblie }} />
                </Col>
                <Col xs={24} sm={24} md={19} xl={19}>
                    <ChatWindow />
                </Col>
            </Row>
        </>
    );
}

export default ChatRoom;
