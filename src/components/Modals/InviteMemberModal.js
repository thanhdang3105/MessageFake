import { Form, Select, Modal, Spin, Avatar } from 'antd'
import React from 'react'
import { AppContext } from '../../context/AppProvider'
// import { AuthContext } from '../../context/AuthProvider'
// import { addDocument } from '../../firebase/services'
import { db } from '../../firebase/config'
import { debounce } from 'lodash'

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props}) {
    const [fetching,setFetching] = React.useState(false)
    const [options,setOptions] = React.useState([])

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([])
            setFetching(true)


            fetchOptions(value).then(newOptions => {
                if(newOptions){
                    setOptions(newOptions)
                    setFetching(false)
                }
            })
        }
        return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout,fetchOptions])

    return (
        <Select
            // labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={ fetching ? <Spin size='small'/> : null}
            {...props}
        >
            {
                // [{label, value, photoURL}]
                options.map(option => (
                    <Select.Option key={option.value} value={option.value} title={option.label}>
                        <Avatar size='small' src={option.photoURL}>{option.photoURL ? '' : option.label?.charAt(0)?.toUpperCase()}</Avatar>
                        {option.label}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

export default function InviteMemberModal() {
    const { isInviteMember, setIsInviteMember, users, selectedRoomId } = React.useContext(AppContext)
    const [form] = Form.useForm()
    const [value, setValue] = React.useState()

    const fetchuserList = async (search) => {
        const valueSearch = [] 
        await users.filter(user => {
            if(user.displayName.toLowerCase().includes(search.toLowerCase()) && !selectedRoomId.members.includes(user.uid)){
                valueSearch.push({
                    label: user.displayName,
                    value: user.uid,
                    photoURL: user.photoURL
                })
            }
            return user
        })
        return valueSearch
    }

    const handleOk = () => {
        const roomRef = db.doc(db.collection(db.getFirestore(),'rooms'),selectedRoomId.id)
        db.updateDoc(roomRef,{
            members: [...selectedRoomId.members,...value]
        })
        setValue([])
        setIsInviteMember(false)
    }

    const handleCancel = () => {
        setIsInviteMember(false)
    }
  return (
    <div>
        <Modal title="Mời bạn" visible={isInviteMember} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form} layout='vertical'>
                <DebounceSelect
                    mode='multiple'
                    label='Tên các thành viên'
                    value={value}
                    placeholder='Nhập tên thành viên'
                    fetchOptions={fetchuserList}
                    onChange={newValue => setValue(newValue)}
                    style={{width: '100%'}}
                />
            </Form>
        </Modal>
    </div>
  )
}
