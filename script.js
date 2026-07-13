const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const clearAllBtn = document.getElementById("clear-all");

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  const existingTasks = Array.from(todoList.querySelectorAll("span")).map(
    (item) => item.innerText.toLowerCase(),
  );

  if (existingTasks.includes(taskText.toLowerCase())) {
    alert("Tugas tersebut sudah ada di daftar!");
    return;
  }

  createTodoItem(taskText);
  todoInput.value = "";
  updateSummary();
});

function createTodoItem(text) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn";

  const taskContainer = document.createElement("div");
  taskContainer.className = "form-check d-flex align-items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "form-check-input me-2 mt-0";

  const label = document.createElement("span");
  label.innerText = text;

  label.addEventListener("dblclick", function () {
    const currentText = label.innerText;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    editInput.className = "form-control form-control-sm";

    taskContainer.replaceChild(editInput, label);
    editInput.focus();

    function saveEdit() {
      const newText = editInput.value.trim();

      if (newText !== "") {
        label.innerText = newText;
      }

      taskContainer.replaceChild(label, editInput);
    }

    editInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        saveEdit();
      }
    });

    editInput.addEventListener("blur", saveEdit);
  });

  taskContainer.appendChild(checkbox);
  taskContainer.appendChild(label);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-link text-danger p-0 border-0";
  deleteBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>';

  li.appendChild(taskContainer);
  li.appendChild(deleteBtn);

  todoList.appendChild(li);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      label.classList.add("completed");
    } else {
      label.classList.remove("completed");
    }
    updateSummary();
  });

  deleteBtn.addEventListener("click", function () {
    li.remove();
    updateSummary();
  });
}

clearAllBtn.addEventListener("click", function () {
  if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
    todoList.innerHTML = "";
    updateSummary();
  }
});

function updateSummary() {
  const totalItems = todoList.children.length;

  const activeItems = Array.from(
    todoList.querySelectorAll(".form-check-input"),
  ).filter((checkbox) => !checkbox.checked).length;

  todoCount.innerText = `${activeItems} tugas tersisa`;

  if (totalItems > 0) {
    clearAllBtn.classList.remove("d-none");
  } else {
    clearAllBtn.classList.add("d-none");
  }
}
