import React from 'react';
import { Row, Col, Button, Typography } from 'antd'
import { auth } from '../../firebase/config'
import { addDocument } from '../../firebase/services'

const { Title } = Typography
const fbProvider = new auth.FacebookAuthProvider()
const googleProvider = new auth.GoogleAuthProvider()

function Login() {
    const handleLoginWithFB = async () => {
        const { _tokenResponse , user } = await auth.signInWithPopup( auth.getAuth(), fbProvider)
        const data = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
        }
        if(_tokenResponse?.isNewUser) {
            try{
                await addDocument('users',data)
            }
            catch(error) {
                console.error(error)
            }
        }
    }

    const handleLoginWithGoogle = async () => {
        const { _tokenResponse , user } = await auth.signInWithPopup( auth.getAuth(), googleProvider)
        const data = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
        }
        if(_tokenResponse?.isNewUser) {
            try{
                await addDocument('users',data)
            }
            catch(error) {
                console.error(error)
            }
        }
    }

    return (
        <div className="login">
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center'  }} level={3}>Fun Chat</Title>
                    <Button style={{ width: '100%', marginBottom: 5 }} onClick={handleLoginWithGoogle}>
                        Đăng nhập bằng Google
                    </Button>
                    <Button style={{ width: '100%'}} onClick={handleLoginWithFB}>
                        Đăng nhập bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default Login;