import React from 'react';
import './Home.css';
import charusatImage from '../assets/charusat.jpg'; // or use URL

const Home = () => {
    return ( <
        div className = "home-content" >
        <
        h1 > Welcome to CHARUSAT < /h1> <
        p >
        CHARUSAT(Charotar University of Science and Technology) is dedicated to academic excellence, innovation, and holistic development.Join a community that inspires growth, knowledge, and leadership. <
        /p> <
        img src = { charusatImage }
        alt = "CHARUSAT Campus" / >
        <
        /div>
    );
};

export default Home;