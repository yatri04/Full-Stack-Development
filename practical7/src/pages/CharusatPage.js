import React from "react";
import "./CharusatPage.css";

const colleges = [{
        name: "CSPIT",
        description: "Chandubhai S. Patel Institute of Technology offers undergraduate and postgraduate engineering programs.",
    },
    {
        name: "DEPSTAR",
        description: "Devang Patel Institute focuses on computer science, IT, and AI programs.",
    },
    {
        name: "IIIM",
        description: "Indukaka Ipcowala Institute of Management offers MBA and BBA programs.",
    },
    {
        name: "RPCP",
        description: "Ramanbhai Patel College of Pharmacy offers D.Pharm, B.Pharm, and M.Pharm.",
    },
    {
        name: "CMPICA",
        description: "Institute of Computer Applications offering BCA and MCA degrees.",
    },
    {
        name: "PDPIAS",
        description: "Offers programs in physics, chemistry, and life sciences.",
    },
    {
        name: "ARIP",
        description: "Physiotherapy programs at undergraduate and postgraduate levels.",
    },
    {
        name: "MTIN",
        description: "Manikaka Topawala Institute of Nursing provides quality nursing education.",
    },
    {
        name: "CIPS",
        description: "Charotar Institute of Paramedical Sciences offers allied health programs.",
    },
];

const CharusatPage = () => {
    return ( <
        div className = "charusat-page" >
        <
        h1 > Institutes Under CHARUSAT < /h1>{" "} <
        div className = "college-grid" > { " " } {
            colleges.map((college, index) => ( <
                div className = "college-card"
                key = { index } >
                <
                h2 > { college.name } < /h2> <p> {college.description} </p > { " " } <
                /div>
            ))
        } { " " } <
        /div>{" "} <
        /div>
    );
};

export default CharusatPage;