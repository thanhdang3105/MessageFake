import React from 'react';
import { Row, Col, Button } from 'antd';
import UserInfo from './UserInfo';
import Roomlist from './Roomlist';
import './ChatRoom.scss';
import './Responsive.scss';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

export default function Sildebar({ showSlideBar: { isVisibleSlideMoblie, setIsVisibleSlideMoblie } }) {
    return (
        <div className="Sildebar">
            <Row>
                {!isVisibleSlideMoblie && (
                    <Button
                        type="link"
                        icon={<CaretRightOutlined />}
                        onClick={() => setIsVisibleSlideMoblie(true)}
                        className="mobileSlider"
                    />
                )}
                <Col span={24} className="Sildebar_user">
                    <UserInfo />
                </Col>
                <Col span={24} className="Sildebar_room">
                    <Roomlist setSlideMobile={setIsVisibleSlideMoblie} />
                </Col>
                {isVisibleSlideMoblie && (
                    <Button
                        type="text"
                        className="unshow_slidebar"
                        icon={<CaretLeftOutlined />}
                        onClick={() => setIsVisibleSlideMoblie(false)}
                    />
                )}
            </Row>
        </div>
    );
}
