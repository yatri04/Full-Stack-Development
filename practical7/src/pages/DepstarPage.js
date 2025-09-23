import React from 'react';
import './DepstarPage.css';

const courses = [{
        title: 'B.Tech in Computer Science and Engineering',
        description: 'Emphasizes advanced computing, AI, and machine learning.',
    }, {
        title: 'B.Tech in Computer Engineering',
        description: 'Focuses on core software development, algorithms, and system design.',
    },
    {
        title: 'B.Tech in Information Technology',
        description: 'Covers IT systems, database, and web technologies.',
    },


];

const DepstarPage = () => {
    return ( <
        div className = "depstar-page" >
        <
        h1 > Courses Offered by DEPSTAR < /h1> <
        div className = "course-list" > {
            courses.map((course, index) => ( <
                div className = "course-card"
                key = { index } >
                <
                h2 > { course.title } < /h2> <
                p > { course.description } < /p> < /
                div >
            ))
        } <
        /div> < /
        div >
    );
};

export default DepstarPage;