import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {


    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return ( <
        >
        { /* Toggle Button */ } <
        div className = "toggle-btn"
        onClick = { toggleSidebar } > ☰
        <
        /div>

        { /* Sidebar */ } <
        div className = { `sidebar ${isOpen ? 'open' : ''}` } >
        <
        h2 className = "sidebar-title" > Menu < /h2> <
        ul className = "sidebar-menu" >
        <
        li > < Link to = "/" > Home < /Link></li >
        <
        li > < Link to = "/charusat" > CHARUSAT < /Link></li >
        <
        li > < Link to = "/depstar" > DEPSTAR < /Link></li >
        <
        li > < Link to = "/depstar-cse" > CSE < /Link></li >
        <
        /ul> < /
        div > <
        />
    );
};

export default Sidebar;