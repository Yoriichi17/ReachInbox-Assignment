import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import 'quill/dist/quill.snow.css'; 

import OneBoxScreen from './components/OneBoxScreen';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/onebox" element={<OneBoxScreen />} />
            </Routes>
        </Router>
    );
}

export default App;
