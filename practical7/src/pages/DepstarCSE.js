import React from "react";
import "./DepstarCSE.css";

const DepstarCSE = () => {
    return ( <
        div className = "depstar-cse" >
        <
        div className = "banner" >
        <
        h1 > Department of Computer Science & Engineering < /h1>{" "} <
        p > { " " }
        Devang Patel Institute of Advanced Technology & Research(DEPSTAR) { " " } <
        /p>{" "} <
        /div> <
        section className = "about" >
        <
        h2 > About the Department < /h2>{" "} <
        p >
        The Department of Computer Science and Engineering at DEPSTAR is committed to producing top - tier graduates with strong technical skills and ethical values.The curriculum is designed to equip students with knowledge in programming, algorithms, data structures, machine learning, and software engineering. { " " } <
        /p>{" "} <
        /section> <
        section className = "labs" >
        <
        h2 > Labs and Facilities < /h2>{" "} <
        p >
        DEPSTAR CSE offers state - of - the - art laboratories including:
        <
        ul >
        <
        li > AI & ML Lab < /li> <li> Data Science Lab </li > { " " } <
        li > Cyber Security Lab < /li> <li> Cloud Computing Lab </li > { " " } <
        /ul>{" "} <
        /p>{" "} <
        /section>{" "} <
        /div>
    );
};

export default DepstarCSE;