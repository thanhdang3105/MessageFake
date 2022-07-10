import { Button, Avatar, Typography } from 'antd';
import { useContext } from 'react';
import { auth, db } from '../../firebase/config';
import { AuthContext } from '../../context/AuthProvider';
import { getDocs, updateDoc } from 'firebase/firestore';

export default function UserInfo() {
    const user = useContext(AuthContext);

    const handleLogout = () => {
        auth.signOut(auth.getAuth());
        getDocs(
            db.query(db.collection(db.getFirestore(), 'users'), db.where('uid', '==', auth.getAuth().currentUser.uid)),
        ).then((snapshot) => {
            snapshot.docs.map((doc) => {
                updateDoc(doc.ref, {
                    isWork: false,
                });
            });
        });
    };

    return (
        <div className="wrapper_slideBar">
            <div className="user_info">
                <Avatar src={user.photoURL} alt="Avatar">
                    {user.photoURL ? '' : user.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography.Text className="username text_black">{user.displayName}</Typography.Text>
            </div>
            <Button ghost className="btn_logout" onClick={handleLogout}>
                Đăng Xuất
            </Button>
        </div>
    );
}
