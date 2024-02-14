import React, { useState, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from './Chat';
import '../App.css'
import UserContext from '../helper/UserContext';



function Form() {
    const {setUser} = useContext(UserContext);
    
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    // var [username, setUsername] = value;
    // var [room, setRoom] = value2;
    const navigate = useNavigate();

    // const providerValue = React.useMemo(()=>({username, setUsername, room, setRoom}),[username, room])
    
    const handleJoin = (e) => {
        // onVariableChange(username, room);
        setUser({username, room});
        e.preventDefault();
        if (username.trim() && room.trim()) {
            navigate(`/Chat`);
            
        } else {
            alert('Please enter both display name and room.');
        }
    };
    
  return (
    <> 
    
       <div className="centered-form">
            <div className="centered-form__box">
                <h1>Join</h1>
                <form onSubmit={handleJoin}>
                    <label>Display name</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Display name"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value)}}
                        required
                    />
                    <label>Room</label>
                    <input
                        type="text"
                        name="room"
                        placeholder="Room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        required
                    />
                    <button type="submit">Join</button>
                </form>
            </div>
        </div>
      
        
    </>
  )
}


export default Form;
