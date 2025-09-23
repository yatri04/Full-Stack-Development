import React, { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return (
        <div style={{ textAlign: 'center', fontFamily: 'Arial' }}>
            <h1>Count: {count}</h1>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setCount(0)}>Reset</button>{' '}
                <button onClick={() => setCount(prev => prev + 1)}>Increment</button>{' '}
                <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>{' '}
                <button onClick={() => setCount(prev => prev + 5)}>Increment 5</button>
            </div>

            <h1><strong>Welcome to CHARUSAT!!!</strong></h1>

            <div>
                <label>
                    First Name:{" "}
                    <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </label>
                <br /><br />
                <label>
                    Last Name:{" "}
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </label>
            </div>

            <br />
            <div>
                <p><strong>First Name:</strong> {firstName}</p>
                <p><strong>Last Name:</strong> {lastName}</p>
            </div>
        </div>
    );
};

export default App;
