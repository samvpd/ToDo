'use strict';

class Todo {
	constructor(form, input, todoList, todoCompleted) {
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem("toDoList")));
		this.todoContainer = document.querySelector(".todo-container");
	}

	addToStorage() {
		localStorage.setItem("toDoList", JSON.stringify([...this.todoData]));
	}

	render() {
		this.todoList.textContent = "";
		this.todoCompleted.textContent = "";
		this.input.value = "";
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}

	createItem(todo) {
		const li = document.createElement("li");
		li.classList.add("todo-item");
		li.key = todo.key;
		li.insertAdjacentHTML("beforeend", `
			<span class="text-todo">${todo.value}</span> 
			<div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button> 
			</div>
    `);
		if (todo.completed) {
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
	}

	addTodo(e) {
		e.preventDefault();
		if (this.input.value.trim() !== "") {
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			};
			this.todoData.set(newTodo.key, newTodo);
			this.render();
		}
	}

	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	deleteItem(e) {
		this.todoData.forEach(item => {
			if (item.key === e.closest("li").key) {
				this.todoData.delete(item.key);
				this.render();
			}
		});
	}

	completedItem(e) {
		this.todoData.forEach(item => {
			if (item.key === e.closest("li").key) {
				item.completed = !item.completed;
				this.render();
			}
		});
	}

	handler() {
		this.todoContainer.addEventListener("click", event => {
			const target = event.target;
			if (target.closest(".todo-complete")) {
				this.completedItem(target);
			} else if (target.closest(".todo-remove")) {
				this.deleteItem(target);
			}
		});
	}

	init() {
		this.form.addEventListener("submit", this.addTodo.bind(this));
		this.render();
		this.handler();
	}

}

const todo = new Todo(".todo-control", ".header-input", ".todo-list", ".todo-completed");

todo.init();