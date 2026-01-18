// src/Reports.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reports.css'; // Import the CSS file for this component

const Reports = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            const response = await axios.get('http://localhost:3000/api/candidates');
            setCandidates(response.data);
        };

        fetchCandidates();
    }, []);

    return (
        <div className="reports-container">
            <h1 className="reports-title">Candidate Test Report</h1>
            <table className="reports-table">
                <thead>
                    <tr>
                        <th className="reports-header">Candidate ID</th>
                        <th className="reports-header">Name</th>
                        <th className="reports-header">Test Score</th>
                        <th className="reports-header">Test Date</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(candidate => (
                        <tr key={candidate.id} className="reports-row">
                            <td className="reports-cell">{candidate.id}</td>
                            <td className="reports-cell">{candidate.name}</td>
                            <td className="reports-cell">{candidate.score}</td>
                            <td className="reports-cell">{candidate.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;