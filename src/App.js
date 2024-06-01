import logo from './logo.svg';
import './App.css';
import './expenseCSS.css';
import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseSummary from './components/ExpenseSummary';
import './expenseCSS.css';

function App() {
    const [expenses, setExpenses] = useState([]);
    const [thaiBahtRate, setThaiBahtRate] = useState(null);

    useEffect(() => {
        const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=a43f78f28245465fb19144d8cede0a7b&symbols=USD,THB';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setThaiBahtRate(data.rates.THB);
            })
            .catch(error => console.error('Error fetching exchange rates:', error));
    }, []);

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
    };

    return (
        <div>
            <h1>Travel Expense Tracker</h1>
            <img src="/watArun.jpg" alt="Picture of Wat Arun In Thailand" />
            <ExpenseForm addExpense={addExpense} />
            <h2>Expense Summary (in US Dollars)</h2>
            <ExpenseSummary expenses={expenses} thaiBahtRate={thaiBahtRate} />
        </div>
    );
}

export default App;