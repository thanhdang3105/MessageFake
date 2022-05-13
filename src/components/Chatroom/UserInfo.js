import { Button, Avatar, Typography } from 'antd'
import { useContext } from 'react'
import { auth } from '../../firebase/config'
import { AuthContext } from '../../context/AuthProvider'

export default function UserInfo() {

  const user = useContext(AuthContext)

  const handleLogout = () => {
    auth.signOut(auth.getAuth())
  }

  return (
    <div className='wrapper_slideBar'>
        <div className='user_info'>
            <Avatar src={user.photoURL} alt='Avatar'>{user.photoURL ? '' : user.displayName?.charAt(0)?.toUpperCase()}</Avatar>
            <Typography.Text className="username text_black">{user.displayName}</Typography.Text>
        </div>
        <Button ghost className='btn_logout' onClick={handleLogout}>Đăng Xuất</Button>
    </div>
  )
}
