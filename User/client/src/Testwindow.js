import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Testwindow.css';
import Aiproctor from "./Ai_proctor"; // Assuming Aiproctor is a component you have

export default function TestWindow() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [codeInput, setCodeInput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // State for warning visibility
  const [warningCount, setWarningCount] = useState(3); // Number of warnings remaining
  const [isFullScreen, setIsFullScreen] = useState(false); // State to track full screen status
  const [showFullScreenPrompt, setShowFullScreenPrompt] = useState(false); // State for full screen prompt modal

  useEffect(() => {
    // Enter full screen on mount
    const enterFullScreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
          await element.msRequestFullscreen();
        }
      } catch (error) {
        console.error('Error entering full screen:', error);
      }
    };
    enterFullScreen().then(() => {
      // Check if full screen was entered
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setShowFullScreenPrompt(true);
      }
    });

    // Hardcoded general knowledge questions
    const hardcodedQuestions = [
      {
        _id: 1,
        questionText: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"]
      },
      {
        _id: 2,
        questionText: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"]
      },
      {
        _id: 3,
        questionText: "Who wrote 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"]
      },
      {
        _id: 4,
        questionText: "What is the largest ocean on Earth?",
        options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"]
      },
      {
        _id: 5,
        questionText: "In which year did World War II end?",
        options: ["1945", "1939", "1950", "1941"]
      },
      {
        _id: 6,
        questionText: "Write a code to check if a number is odd or even.",
        isCoding: true
      }
    ];
    setQuestions(hardcodedQuestions);

    // Handle window blur and focus
    const handleBlur = () => {
      console.log('Window blurred, showing warning');
      setShowWarning(true);
      setWarningCount(prev => {
        const newCount = prev - 1;
        console.log('Warning count:', newCount);
        if (newCount <= 0) {
          navigate('/Thankyou'); // Auto-submit when warnings reach 0
        }
        return newCount;
      });
    };

    const handleFocus = () => {
      console.log('Window focused');
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        // User exited full screen during test, re-enter and show warning
        enterFullScreen();
        setShowWarning(true);
        setWarningCount(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            navigate('/Thankyou'); // Auto-submit when warnings reach 0
          }
          return newCount;
        });
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [isFullScreen, navigate]);



  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: value
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  const runTests = () => {
    const testCases = [
      { input: 2, expected: 'even' },
      { input: 3, expected: 'odd' },
      { input: 0, expected: 'even' },
      { input: -1, expected: 'odd' },
      { input: 10, expected: 'even' }
    ];

    const results = testCases.map(test => {
      try {
        // Create a function with the user's logic
        const func = new Function('num', codeInput);
        const result = func(test.input).toLowerCase();
        const passed = result === test.expected;
        return { ...test, result, passed };
      } catch (error) {
        return { ...test, result: 'Error', passed: false };
      }
    });

    setTestResults(results);
    const allPassed = results.every(r => r.passed);
    setIsCodeCorrect(allPassed);
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const allAnswered = questions.every((question, index) => {
      if (question.isCoding) {
        return isCodeCorrect;
      } else {
        return selectedAnswers[index] !== undefined;
      }
    });
    if (allAnswered) {
      navigate('/Thankyou');
    } else {
      alert('Please answer all questions and pass the coding tests before submitting.');
    }
  };

  const handleEnterFullScreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { // Safari
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) { // IE/Edge
        await element.msRequestFullscreen();
      }
      setIsFullScreen(true);
      setShowFullScreenPrompt(false);
    } catch (error) {
      console.error('Error entering full screen:', error);
    }
  };

  return (
    <div className="Testwindow">
      {isFullScreen && (
        <>
          <h1 className="h1-test">Assessment</h1>
          <div className="proper-align">
            <Aiproctor className="webcam1" />
            <div className="container-test">
              {currentQuestion && (
                <>
                  <h5 className="h5-test">Q.No: {currentQuestionIndex + 1}</h5>
                  <div className="question">
                    <p>{currentQuestion.questionText}</p>
                    {currentQuestion.isCoding ? (
                      <div>
                        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', border: '1px solid #ccc', fontFamily: 'monospace' }}>
{`public class Solution {
    public static String isEven(int num) {
        // Write your logic here
        ${codeInput}
    }
}`}
                        </pre>
                        <textarea
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          placeholder="Write your logic here... "
                          rows="5"
                          cols="50"
                        />
                        <br />
                        <button onClick={runTests}>Run Tests</button>
                        {testResults.length > 0 && (
                          <div>
                            <h4>Test Results:</h4>
                            <ul>
                              {testResults.map((test, index) => (
                                <li key={index}>
                                  Input: {test.input}, Expected: {test.expected}, Result: {test.result}, Passed: {test.passed ? 'Yes' : 'No'}
                                </li>
                              ))}
                            </ul>
                            {isCodeCorrect && <p style={{ color: 'green' }}>All tests passed!</p>}
                          </div>
                        )}
                      </div>
                    ) : (
                      <ul className="answers">
                        {currentQuestion.options.map((option, index) => (
                          <li key={index}>
                            <input
                              type="radio"
                              name={`q${currentQuestion._id}`}
                              value={option}
                              className="bullet"
                              checked={selectedAnswers[currentQuestionIndex] === option}
                              onChange={handleOptionChange}
                            />
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                    {currentQuestion.isCoding ? (
                      codeInput && (
                        <p className="selected-answer">
                          Code: {codeInput}
                        </p>
                      )
                    ) : (
                      selectedAnswers[currentQuestionIndex] !== undefined && (
                        <p className="selected-answer">
                          Selected Answer: {selectedAnswers[currentQuestionIndex]}
                        </p>
                      )
                    )}
                  </div>
                </>
              )}
              <br />
              <div className="buttons">
                <button
                  className="btn-prev"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    className="btn-next"
                    onClick={nextQuestion}
                  >
                    Next
                  </button>
                ) : (
                  <button className="btn-submit" onClick={handleSubmit}>
                    End test
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {showFullScreenPrompt && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-modal">
            <h2>Full Screen Required</h2>
            <p>To start the assessment, please enter full screen mode.</p>
            <button onClick={handleEnterFullScreen}>Enter Full Screen</button>
          </div>
        </div>
      )}
      {showWarning && (
        <div className="popup-backdrop">
          <div className="popup-warning">
            <h2>Warning!</h2>
            <p>You have switched tabs. Warnings remaining: {warningCount}</p>
            <button onClick={() => setShowWarning(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
