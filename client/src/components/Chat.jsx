import React, { useEffect, useState } from 'react'
import { socket, useSocket } from '../socket/socket'

export default function Chat() {
  const { isConnected, messages, users, typingUsers, connect, disconnect, sendMessage, sendPrivateMessage, setTyping } = useSocket()

  const [username, setUsername] = useState('')
  const [input, setInput] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  const handleJoin = () => {
    if (!username) return
    connect(username)
  }

  const handleSend = () => {
    if (!input) return
    if (selectedUser) {
      sendPrivateMessage(selectedUser.id, input)
    } else {
      sendMessage({ message: input })
    }
    setInput('')
    setTyping(false)
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id} className={selectedUser?.id === u.id ? 'selected' : ''} onClick={() => setSelectedUser(u)}>
              {u.username} {u.id === socket.id ? '(you)' : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="main">
        <div className="join">
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={handleJoin} disabled={isConnected}>Join</button>
        </div>

        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.isPrivate ? 'private' : ''}`}>
              <div className="meta">
                <strong>{m.sender}</strong>
                <span className="time">{new Date(m.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="body">{m.message}</div>
            </div>
          ))}
        </div>

        <div className="typing">
          {typingUsers.length > 0 && <div>{typingUsers.join(', ')} is typing...</div>}
        </div>

        <div className="composer">
          <input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => { setInput(e.target.value); setTyping(true) }}
            onBlur={() => setTyping(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}
