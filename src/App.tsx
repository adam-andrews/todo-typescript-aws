import React, { useEffect, useState, SetStateAction } from 'react';
import './App.css';
//This is a comment
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const initialState = { name: '', description: '' };
const App = () => {
	const [formState, setFormState] = useState(initialState);
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetchTodos();
	}, []);

	const setInput = (key: any, value: any): any => {
		setFormState({ ...formState, [key]: value });
	};

	const fetchTodos = async (): Promise<any> => {
		try {
			const todoData: any = await API.graphql(graphqlOperation(listTodos));
			const todos: any = todoData.data.listTodos.items;
			setTodos(todos);
		} catch (err) {
			console.log('error fetching todos');
		}
	};

	const addTodo = async (): Promise<any> => {
		try {
			if (!formState.name || !formState.description) return;
			const todo = { ...formState };
			setTodos([...todos, todo] as SetStateAction<never[]>);
			setFormState(initialState);
			await API.graphql(graphqlOperation(createTodo, { input: todo }));
		} catch (err) {
			console.log('error creating todo:', err);
		}
	};

	return (
		<div className="w-96 flex mx-auto flex-col justify-center p-5">
			<h2>Amplify Todos</h2>
			<input
				onChange={(event) => setInput('name', event.target.value)}
				value={formState.name}
				placeholder="Title"
        className='border-none bg-gray-200 mb-3 p-2 text-lg'
			/>
			<input
				onChange={(event) => setInput('description', event.target.value)}
				value={formState.description}
				placeholder="Description"
        className='border-none bg-gray-200 mb-3 p-2 py-2 text-lg'

			/>
			<button className = "p-4 bg-black text-white"onClick={addTodo}>Create Todo</button>
			{todos.map((todo: any, index: any) => (
				<div key={todo.id ? todo.id : index} className="mb-4">
					<p className="text-lg font-bold">{todo.name}</p>
					<p className="mb-0">{todo.description}</p>
				</div>
			))}
		</div>
	);
};

export default App;


