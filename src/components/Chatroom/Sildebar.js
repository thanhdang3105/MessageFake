import React from 'react'
import { Row, Col, Button } from 'antd'
import UserInfo from './UserInfo'
import Roomlist from './Roomlist'
import './ChatRoom.scss'
import './Responsive.scss'
import { CaretLeftOutlined } from '@ant-design/icons'

export default function Sildebar({showSlideBar}) {
  return (
      <div className='Sildebar'>
        <Row>
            <Col span={24} className='Sildebar_user'><UserInfo/></Col>
            <Col span={24} className='Sildebar_room'><Roomlist/></Col>
            {showSlideBar.isVisibleSlideMoblie && <Button type='text' className='unshow_slidebar' icon={<CaretLeftOutlined/>} 
            onClick={() => showSlideBar.setIsVisibleSlideMoblie(false)}/>}
        </Row>
      </div>
  )
}
