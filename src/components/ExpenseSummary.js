import React from 'react';

function ExpenseSummary({ expenses, thaiBahtRate }) {
    const categoryTotals = expenses.reduce((totals, expense) => {
        const category = expense.category;
        const amount = expense.price / thaiBahtRate;
        if (totals[category]) {
            totals[category] += amount;
        } else {
            totals[category] = amount;
        }
        return totals;
    }, {});

    return (
        <div id="summary">
            {Object.keys(categoryTotals).map((category) => (
                <p key={category}>{category}: ${categoryTotals[category].toFixed(2)}</p>
            ))}
        </div>
    );
}

export default ExpenseSummary;
