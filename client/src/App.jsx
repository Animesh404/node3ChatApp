import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from './components/Form';
import Chat from './components/Chat';
import { useState } from 'react';
// import {username} from './components/Form'
import UserContextProvider from './helper/UserContextProvider';

const App = () => {
  
  return (
    <UserContextProvider>
    <Router>
      <Routes>
        <Route path={`/Chat`} element={<Chat />} />
        <Route path='/' element={<Form />}/>
      </Routes>
    </Router>
    </UserContextProvider>
  )
}

export default App