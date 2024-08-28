import React from 'react';
import { Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import 'quill/dist/quill.snow.css'; 
import OneBoxScreen from './components/OneBoxScreen';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/ReachInbox-Assignment" element={<Login />} />
                <Route path="/ReachInbox-Assignment/onebox" element={<OneBoxScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
