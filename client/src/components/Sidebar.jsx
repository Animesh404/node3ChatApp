import React, {useContext} from 'react';
import UserContext from '../helper/UserContext';

const Sidebar = ({ room, users }) => {
    console.log(users);
  return (
    <div>
      <h2 className="room-title">{room}</h2>
      <h3 className="list-title">Users</h3>
      <ul className="users">
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;