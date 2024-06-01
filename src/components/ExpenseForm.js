import React, { useState } from 'react';

function ExpenseForm({ addExpense }) {
    const [itemName, setItemName] = useState('');
    // useState('') is basically a way to set the state and in this line 
    // it updates the code to an empty string which is the useState function
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense({ itemName, category, price: parseFloat(price) });
        setItemName('');
        setCategory('');
        setPrice('');
    };

    return (
        <form id="expenseForm" onSubmit={handleSubmit}>
            <label htmlFor="itemName">Item Name:</label>
            <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <label htmlFor="category">Category:</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <label htmlFor="price">Price (in Thai Baht):</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <button type="submit">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;