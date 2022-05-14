import { Form, Input, Modal } from 'antd'
import React from 'react'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import { addDocument } from '../../firebase/services'

export default function AddRoomModal() {
    const { isAddRoom, setIsAddRoom } = React.useContext(AppContext)
    const [form] = Form.useForm()
    const user = React.useContext(AuthContext)

    const handleOk = () => {
        addDocument('rooms',{...form.getFieldValue(), backgroundURL: '', members: [user.uid]})
        form.resetFields()
        setIsAddRoom(false)
    }

    const handleCancel = () => {
        setIsAddRoom(false)
    }
  return (
    <div>
        <Modal title="Tạo phòng" visible={isAddRoom} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form} layout='vertical'>
                <Form.Item label='Tên phòng' name='name'>
                    <Input placeholder='Nhập tên phòng'/>
                </Form.Item>
                <Form.Item label='Mô tả' name='description'>
                    <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} placeholder='Nhập mô tả'/>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  )
}
