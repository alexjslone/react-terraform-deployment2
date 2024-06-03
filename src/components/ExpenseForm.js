import React from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  SimpleGrid,
  Group,
  Title,
  Button
} from '@mantine/core';

const ExpenseForm = ({ addExpense }) => {
  const form = useForm({
    initialValues: {
      itemName: '',
      category: '',
      price: '',
    },
    validate: {
      itemName: (value) => value.trim().length < 2,
      category: (value) => value.trim().length === 0,
      price: (value) => isNaN(Number(value)) || Number(value) <= 0,
    },
  });

  const handleSubmit = async (values) => {
    try {
      const apiUrl = 'http://localhost:3001/expenses'; // Mock server URL
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        addExpense({ ...values, totalInUSD: data.totalInUSD || values.price }); // Mock response handling
      } else {
        console.error('Error calculating total.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title
        order={2}
        size="h1"
        style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
        fw={900}
        ta="center"
      >
        Submit Expense
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
        <TextInput
          label="Item Name"
          placeholder="Item name"
          name="itemName"
          variant="filled"
          {...form.getInputProps('itemName')}
        />
        <TextInput
          label="Category"
          placeholder="Category"
          name="category"
          variant="filled"
          {...form.getInputProps('category')}
        />
        <TextInput
          label="Price (THB)"
          placeholder="Price in THB"
          name="price"
          variant="filled"
          {...form.getInputProps('price')}
        />
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Button type="submit" size="md">Submit</Button>
      </Group>
    </form>
  );
};

export default ExpenseForm;


/*

import React, { useState } from 'react';

function ExpenseForm({ addExpense }) {
    const [itemName, setItemName] = useState('');
    // useState('') is basically a way to set the state and in this line 
    // it updates the code to an empty string which is the useState function
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
       // addExpense({ itemName, category, price: parseFloat(price) });
       /*
            Basically this is setting it up 
       

        const expense = { itemName, category, price: parseFloat(price) };
        try {
            const apiUrl = 'http://localhost:3001/expenses'; // Replace with your actual API Gateway URL
            const response = fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });
        
            if (response.ok) {
                const data = response.json();
                // Update the expense with the total in USD
                addExpense({ ...expense, totalInUSD: data.totalInUSD });
            } else {
                console.error('Error calculating total.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        
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

*/