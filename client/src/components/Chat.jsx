import React, { useContext, useEffect, useState } from 'react';
// import Mustache from 'mustache';
import moment from 'moment';
import Qs from 'qs';
import io from 'socket.io-client';
import Sidebar from './Sidebar';
import '../App.css';
import UserContext from '../helper/UserContext'



const socket = io("http://localhost:3000/");

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const {user} = useContext(UserContext);
    // const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const username = user.username;
        const room = user.room;

    useEffect(() => {
        // const { username, room } = Qs.parse(window.location.search, {
        //     ignoreQueryPrefix: true,
        // });
        // setUsername(username);
        // setRoom(room);
        socket.on('message', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
          console.log(username, room);
          autoscroll();
      });

        
        socket.on('locationMessage', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('roomData', ({ room, users }) => {
          // Handle room data update if necessary
          return(
            <Sidebar room={room} users={users} />
          )
      });
      socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error);
            window.location.href = '/';
        }
    });

        return () => {
          if (socket.readyState === 1) { 
            socket.close();
        }
        };
    }, []);

    
    const autoscroll = () => {
      const messagesDiv = document.getElementById('messages');
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', message, (error) => {
                if (error) {
                    console.log(error);
                    alert('Message not delivered!');
                } else {
                    console.log('Message delivered!');
                    setMessage('');
                }
            });
        }
    };

    const sendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('sendLocation', { latitude, longitude }, () => {
                    console.log('Location shared!');
                });
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    return (
        <div className="chat">
            <div id="sidebar" className="chat__sidebar">
                {/* Sidebar content goes here */}
                
            </div>
            <div className="chat__main">
                <div id="messages" className="chat__messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <p>
                                <span className="message__name">{msg.username}</span>
                                <span className="message__meta">
                                    {moment(msg.createdAt).format('h:mm a')}
                                </span>
                            </p>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.url && (
                                <p>
                                    <a href={msg.url} target="_blank" rel="noopener noreferrer">
                                        My current location
                                    </a>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                <div className="compose">
                    <form id="message-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            name="message"
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            autoComplete="off"
                        />
                        <button type="submit">Send</button>
                    </form>
                    <button id="send-location" onClick={sendLocation}>
                        Send location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
