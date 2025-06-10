// Get DOM elements
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Render initial todos
renderTodos();

// Add todo function
function addTodo() {
    const todoText = todoInput.value.trim();
    
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        
        todos.push(todo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
}

// Delete todo function
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Drag and Drop functions
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    // Remove drag-over class from all items
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function dragOver(e) {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('.todo-item:not(.dragging)')];
    
    // Remove drag-over class from all items
    siblings.forEach(item => item.classList.remove('drag-over'));
    
    const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        
        // Add drag-over class to items that are being hovered over
        if (offset < 0) {
            sibling.classList.add('drag-over');
        }
        
        return offset < 0;
    });
    
    todoList.insertBefore(draggingItem, nextSibling);
}

function drop(e) {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
    const newOrder = [...todoList.querySelectorAll('.todo-item')].map(item => 
        parseInt(item.id)
    );
    
    // Reorder todos array based on new order
    todos = newOrder.map(id => todos.find(todo => todo.id === id));
    saveTodos();
}

// Render todos to the DOM
function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.id = todo.id;
        li.draggable = true;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragend', dragEnd);
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onclick="toggleTodo(${todo.id})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">❌</button>
        `;
        
        todoList.appendChild(li);
    });
}

// Add event listeners for drag and drop
todoList.addEventListener('dragover', dragOver);
todoList.addEventListener('drop', drop);

// Add todo when Enter key is pressed
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
}); 