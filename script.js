document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks.push(...storedTasks);
        updateUI();
    }
});

let tasks = [];

const getTaskInput = () => document.querySelector("#task-input");
const getProgressBar = () => document.querySelector("#progress");
const getNumbersElement = () => document.querySelector("#numbers");
const getTaskList = () => document.querySelector(".task-list");

const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const showError = (message) => {
    alert(message);
};

const addTask = () => {
    const taskInput = getTaskInput();
    const text = taskInput.value.trim();

    if (!text) {
        showError("Task cannot be empty.");
        return;
    }

    tasks.push({ text, completed: false });
    taskInput.value = '';
    taskInput.focus();
    updateUI();
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateUI();
};

const editTask = (index) => {
    const taskInput = getTaskInput();
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateUI();
    taskInput.focus();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateUI();
};

let hasCelebrated = false;

const updateUI = () => {
    updateStats();
    renderTasks();
    saveTasks();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    getProgressBar().style.width = `${progress}%`;
    getNumbersElement().innerText = `${completedTasks} / ${totalTasks}`;

    if (totalTasks && completedTasks === totalTasks && !hasCelebrated) {
        celebrate();
        hasCelebrated = true;
    } else if (completedTasks !== totalTasks) {
        hasCelebrated = false;
    }
};

const renderTasks = () => {
    const taskList = getTaskList();
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="task-item">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as complete" />
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <i class="fa-solid fa-pen-to-square edit-btn" title="Edit task" data-index="${index}"></i>
                    <i class="fa-solid fa-trash delete-btn" title="Delete task" data-index="${index}"></i>
                </div>
            </div>
        `;

        const checkbox = listItem.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTaskComplete(index));

        const editButton = listItem.querySelector(".edit-btn");
        editButton.addEventListener("click", () => editTask(index));

        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => deleteTask(index));

        taskList.appendChild(listItem);
    });
};

document.querySelector("#new-tasks-btn").addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

getTaskInput().addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});

const celebrate = () => {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
    });
};

