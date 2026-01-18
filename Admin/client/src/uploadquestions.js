import React, { useState, useEffect } from "react";
import './uploadquestions.css';

export default function UploadQuestions() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [questionsList, setQuestionsList] = useState([]);
    const [error, setError] = useState(null); // State to handle errors

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, options }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message); // Success message from the server
            
            // Optionally reset the form
            setQuestion('');
            setOptions(['', '', '', '']);
            
            // Fetch updated questions list
            fetchQuestions();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message); // Set the error message
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/questions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched questions:', data); // Log the fetched data
            setQuestionsList(data.questions || []); // Ensure 'data.questions' is an array
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError(error.message); // Set the error message
        }
    };

    useEffect(() => {
        fetchQuestions(); // Fetch questions when the component mounts
    }, []);

    return (
        <div className="uploadquestions">
            <h1 className="title">Upload Questions</h1>
            <form onSubmit={handleSubmit}>
                <label className="label" htmlFor="questionbox">Enter the Question:</label>
                <br />
                <input 
                    type="text" 
                    className="textbox" 
                    id="questionbox" 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <br /><br />

                <div className="options">
                    {options.map((option, index) => (
                        <div key={index}>
                            <label className="label" htmlFor={`optionbox${index}`}>Enter Option {index + 1}:</label>
                            <br />
                            <input 
                                type="text" 
                                className="textbox" 
                                id={`optionbox${index}`} 
                                value={option} 
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            <br /><br />
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>

            {error && <p className="error-message">{error}</p>} {/* Display error message */}

            <h2>Questions List</h2>
            <ul>
                {Array.isArray(questionsList) && questionsList.length > 0 ? (
                    questionsList.map((q, index) => (
                        <li key={index}>
                            <strong>{q.question}</strong>
                            <ul>
                                {Array.isArray(q.options) && q.options.map((opt, optIndex) => (
                                    <li key={optIndex}>{opt}</li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li>No questions available.</li>
                )}
            </ul>
        </div>
    );
}