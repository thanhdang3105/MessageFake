import { Avatar, Typography } from 'antd'
import { formatRelative } from 'date-fns/esm'
import React, { memo } from 'react'

function formatDate(seconds) {
  let formatedDate = ''
  if(seconds){
    formatedDate = formatRelative(new Date(seconds * 1000), new Date())

    formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
  }

  return formatedDate
}

function Message({ text, displayName, createdAt, photoUrl }) {
  
  return (
    <div className="message">
        <div className="message_avatar">
          <Avatar className="avatar_user" src={photoUrl} alt={displayName}>{photoUrl ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
        </div>
        <div className="message_box">
          <div className="message_user">
              <Typography.Text className='name_user'>{displayName}</Typography.Text>
              <Typography.Text className='message_createdAt'>{formatDate(createdAt?.seconds)}</Typography.Text>
          </div>
          <div className="message_text">
              <Typography.Text className='content_message'>{text}</Typography.Text>
          </div>
        </div>
    </div>
  )
}

export default memo(Message)