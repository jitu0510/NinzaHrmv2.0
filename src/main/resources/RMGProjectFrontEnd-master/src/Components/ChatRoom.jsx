import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import '../CSS/ChatRoom.css';
import { color } from 'd3';
import acoe from './ACOE3.png';

const url1 = process.env.REACT_APP_APP_URL;
const port = process.env.REACT_APP_APP_PORT;

let stompClient = null;
const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState('');
  const [userData, setUserData] = useState({
    username: localStorage.getItem('name') || '',
    connected: false,
    message: '',
    role: localStorage.getItem('userrole') || '',
  });

  useEffect(() => {
    localStorage.setItem('page', '/dashboard/chat');
  }, [userData]);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats'));
    if (savedChats) {
      setPrivateChats(new Map(savedChats.privateChats));
      setTab(savedChats.tab);
    }
  }, []);

  const saveChatsToLocalStorage = () => {
    const chatsData = {
      privateChats: [...privateChats],
      tab,
    };
   // localStorage.setItem('chats', JSON.stringify(chatsData));
  };

  const connect = () => {
    const url = `/ws`;
    let Sock = new SockJS(url);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
    stompClient.subscribe('/chatroom/users', onUserListReceived);
    if (userData.role === 'admin') {
      stompClient.subscribe('/chatroom/public', onMessageReceived);
    }
    userJoin();
  };

  const onUserListReceived = (payload) => {
    const usersList = JSON.parse(payload.body);
    const newPrivateChats = new Map();
    usersList.forEach((user) => {
      if (!privateChats.get(user)) {
        newPrivateChats.set(user, []);
      } else {
        newPrivateChats.set(user, privateChats.get(user));
      }
    });
    setPrivateChats(new Map(newPrivateChats));
  };

  const userJoin = () => {
    const chatMessage = {
      senderName: userData.username,
      status: 'JOIN',
    };
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    if (payloadData.status === 'JOIN' && userData.role === 'admin') {
      if (!privateChats.get(payloadData.senderName)) {
        privateChats.set(payloadData.senderName, []);
        setPrivateChats(new Map(privateChats));
        saveChatsToLocalStorage();
      }
    }
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    const senderName = payloadData.senderName;

    if (!privateChats.get(senderName)) {
      privateChats.set(senderName, []);
    }

    privateChats.get(senderName).push(payloadData);
    setPrivateChats(new Map(privateChats));
    saveChatsToLocalStorage();
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: userData.role === 'admin' ? tab : 'rmgyantra',
        message: userData.message,
        status: 'MESSAGE',
      };

      const receiver = userData.role === 'admin' ? tab : 'rmgyantra';
      if (!privateChats.get(receiver)) {
        privateChats.set(receiver, []);
      }

      privateChats.get(receiver).push(chatMessage);
      setPrivateChats(new Map(privateChats));
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: '' });
      saveChatsToLocalStorage();
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    // localStorage.setItem('name', userData.username);
    connect();
  };

  const isAdmin = userData.role === 'admin';
  const isUser = userData.role !== 'admin';

  return (
    <div className="chat-container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li style={{color:"green"}}><b>Chats</b></li>
              {isAdmin &&
                [...privateChats.keys()]
                  .filter((name) => name !== 'rmgyantra')
                  .map((name, index) => (
                    <li
                      onClick={() => setTab(name)}
                      className={`member ${tab === name && 'active'}`}
                      key={index}
                    
                    >
                      {name}
                     
                    </li>
                    
                  ))}
              {isUser && (
                <li
                  onClick={() => setTab('rmgyantra')}
                  className={`member ${tab === 'rmgyantra' && 'active'}`}
                >
                  Admin
                </li>
              )}
            </ul>
          </div>
          {tab && (
            <div className="chat-content">
              <ul className="chat-messages">
                {privateChats.get(tab)?.map((chat, index) => (
                  <li
                    className={`message ${chat.senderName === userData.username && 'self'}`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName[0]}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName[0]}</div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendPrivateValue}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <label className="username-label">UserName:</label>
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            disabled
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button>
        </div>
      )}
      <div style={{marginLeft:"35%",marginTop:"0%"}}>
<footer>Designed and Developed by <img src={acoe} alt="" width="40px" /> </footer>

</div>
    </div>
  );
};
export default ChatRoom;