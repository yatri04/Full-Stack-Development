import React, { useState } from 'react';
import './App.css';

const App = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');

    const buttons = [
        '/', '*', '+', '-', 'DEL',
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        '0', '.', '='
    ];

    const handleClick = (value) => {
        if (value === 'DEL') {
            setExpression((prev) => prev.slice(0, -1));
            return;
        }

        if (value === '=') {
            try {
                // eslint-disable-next-line no-eval
                const evalResult = eval(expression);
                setResult(evalResult);
            } catch {
                setResult('Error');
            }
            return;
        }

        setExpression((prev) => prev + value);
    };

    return ( <
        div className = "calculator" >
        <
        div className = "display" >
        <
        small > { result !== '' ? `(${result})` : '' } < /small> <
        h1 > { expression || '0' } < /h1> <
        /div> <
        div className = "buttons" > {
            buttons.map((btn, index) => ( <
                button key = { index }
                className = {
                    ['/', '*', '+', '-', 'DEL'].includes(btn) ? 'operator' : '' }
                onClick = {
                    () => handleClick(btn) } >
                { btn } <
                /button>
            ))
        } <
        /div> <
        /div>
    );
};

export default App;