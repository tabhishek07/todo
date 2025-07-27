// 🌱 DOM references
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("task_ctr");
const progressBar = document.getElementById("progress_bar");

// 📦 Load tasks from localStorage or start empty
let tasks = JSON.parse(localStorage.getItem("todo-tasks")) || [];

// 💾 Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

// ➕ Add new task
function addtodo() {
  const data = taskInput.value.trim();
  if (data === "") return;

  const task = {
    id: Date.now(),
    text: data,
    completed: false,
  };

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// ✔️ Toggle task completion
function toggleTask(id) {
  tasks = tasks.map(
    (task) => (task.id === id ? { ...task, completed: !task.completed } : task)
  );
  saveTasks();
  renderTasks();
}

// ❌ Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// 📝 Render all tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    const span = document.createElement("span");
    span.textContent = task.text;

    // ✏️ DOUBLE CLICK TO EDIT
    span.ondblclick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.className = "edit-input";
      li.replaceChild(input, contentDiv);
      input.focus();

      const save = () => {
        const newText = input.value.trim();
        if (newText !== "") {
          task.text = newText;
          saveTasks();
          renderTasks();
        } else {
          renderTasks();
        }
      };

      input.onblur = save;
      input.onkeydown = (e) => {
        if (e.key === "Enter") save();
      };
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "del-btn";
    delBtn.onclick = () => deleteTask(task.id);

    const contentDiv = document.createElement("div"); // 👈 wrapper for checkbox + span
    contentDiv.className = "task-content";
    contentDiv.append(checkbox, span);

    li.append(contentDiv, delBtn); // no edit button here
    taskList.appendChild(li);
  });

  updateCounter();
}

// 📊 Update progress bar and counter
function updateCounter() {
  const completed = tasks.filter((t) => t.completed).length;
  taskCounter.textContent = `${completed}/${tasks.length}`;

  const percentage = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
  progressBar.style.width = `${percentage}%`;
}

// 🚀 Load everything on page start
window.onload = () => {
  renderTasks();
};

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addtodo(); // ✅ Adds the task just like the button
  }
});