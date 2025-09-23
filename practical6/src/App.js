import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setCurrentTask(transcript);
        }
    }, [transcript]);

    const handleAddTask = () => {
        if (!currentTask.trim()) return;

        if (editIndex !== null) {
            const updatedTasks = [...tasks];
            updatedTasks[editIndex].text = currentTask;
            setTasks(updatedTasks);
            setEditIndex(null);
        } else {
            setTasks([...tasks, { text: currentTask, completed: false }]);
        }

        setCurrentTask("");
        resetTranscript();
    };

    const handleDelete = (index) => {
        const updated = tasks.filter((_, i) => i !== index);
        setTasks(updated);
    };

    const handleEdit = (index) => {
        setCurrentTask(tasks[index].text);
        setEditIndex(index);
    };

    const handleComplete = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = true;
        setTasks(updatedTasks);
    };

    const handleStartListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: false });
    };

    if (!browserSupportsSpeechRecognition) {
        return <p > Your browser doesn 't support speech recognition.</p>;
    }

    return ( <
        div className = "container" >
        <
        h1 > Get Things Done! < /h1>{" "} <
        div className = "input-group" >
        <
        input type = "text"
        placeholder = "What is the task today?"
        value = { currentTask }
        onChange = {
            (e) => setCurrentTask(e.target.value) }
        />{" "} <
        button onClick = { handleAddTask } > Add Task < /button>{" "} <
        button className = "mic"
        onClick = { handleStartListening } > { " " }🎤 { listening ? "Listening..." : "Speak" } { " " } <
        /button>{" "} <
        /div> {
            tasks
                .filter((task) => !task.completed)
                .map((task, index) => ( <
                    div className = "task"
                    key = { index } >
                    <
                    span > { task.text } < /span>{" "} <
                    div >
                    <
                    button onClick = {
                        () => handleEdit(index) } > ✏️ < /button>{" "} <
                    button onClick = {
                        () => handleDelete(index) } > 🗑️ < /button>{" "} <
                    button onClick = {
                        () => handleComplete(index) } > ✅ < /button>{" "} <
                    /div>{" "} <
                    /div>
                ))
        } { " " } <
        /div>
    );
};

export default App;