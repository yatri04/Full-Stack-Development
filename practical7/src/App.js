import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import CharusatPage from './pages/CharusatPage';
import DepstarPage from './pages/DepstarPage';
import DepstarCSE from './pages/DepstarCSE';

const App = () => {
    return ( <
        Router >
        <
        div style = {
            { display: 'flex' } } > { /* Sidebar always visible */ } <
        Sidebar / >

        { /* Main content */ } <
        div style = {
            { flexGrow: 1, padding: '30px', marginLeft: '240px', background: '#f5f5f5', minHeight: '100vh' } } >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/charusat"
        element = { < CharusatPage / > }
        /> <
        Route path = "/depstar"
        element = { < DepstarPage / > }
        /> <
        Route path = "/depstar-cse"
        element = { < DepstarCSE / > }
        /> <
        /Routes> <
        /div> <
        /div> <
        /Router>
    );
};

export default App;