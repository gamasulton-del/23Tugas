// seleksi elemen dom
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const clearAllBtn = document.getElementById("clear-all");

// event listener saat form disubmit
todoForm.addEventListener("submit", function (event) {
  event.preventDefault(); // mencegah reload halaman

  const taskText = todoInput.value.trim();

  // validasi karakter kosong
  if (taskText === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  // cek duplikasi tugas
  const existingTasks = Array.from(todoList.querySelectorAll("span")).map(
    (item) => item.innerText.toLowerCase(),
  );

  if (existingTasks.includes(taskText.toLowerCase())) {
    alert("Tugas tersebut sudah ada di daftar!");
    return;
  }

  createTodoItem(taskText); // buat item baru
  todoInput.value = ""; // reset input
  updateSummary(); // update summary tugas
});

// fungsi untuk buat elemen to-do baru (dom manipulation)
function createTodoItem(text) {
  // buat elemen <li> baru
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn";

  // buat container untuk teks dan checkbox
  const taskContainer = document.createElement("div");
  taskContainer.className = "form-check d-flex align-items-center gap-2";

  // buat checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "form-check-input me-2 mt-0";

  // buat label teks
  const label = document.createElement("span");
  label.innerText = text;

  // event double click untuk edit tugas
  label.addEventListener("dblclick", function () {
    const currentText = label.innerText;

    // buat input sementara
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    editInput.className = "form-control form-control-sm";

    // ganti span jadi input
    taskContainer.replaceChild(editInput, label);
    editInput.focus();

    function saveEdit() {
      const newText = editInput.value.trim();

      if (newText !== "") {
        label.innerText = newText; // update teks label
      }

      // kembalikan input jadi span
      taskContainer.replaceChild(label, editInput);
    }

    // simpan saat enter ditekan
    editInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        saveEdit();
      }
    });

    // simpan saat input kehilangan fokus
    editInput.addEventListener("blur", saveEdit);
  });

  // gabungkan checkbox dan label ke container
  taskContainer.appendChild(checkbox);
  taskContainer.appendChild(label);

  // buat tombol hapus
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-link text-danger p-0 border-0";
  deleteBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>';

  // gabungkan semua ke dalam elemen li
  li.appendChild(taskContainer);
  li.appendChild(deleteBtn);

  // tambahkan elemen li ke dalam ul
  todoList.appendChild(li);

  // --- event listener internal untuk setiap item ---

  //   event saat checkbox dicentang
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      label.classList.add("completed");
    } else {
      label.classList.remove("completed");
    }
    updateSummary();
  });

  // event saat tombol hapus diklik
  deleteBtn.addEventListener("click", function () {
    li.remove(); // hapus elemen li dari dom
    updateSummary();
  });
}

// event listener untuk tombol hapus semua
clearAllBtn.addEventListener("click", function () {
  if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
    todoList.innerHTML = ""; // hapus semua item dari list
    updateSummary();
  }
});

// fungsi untuk update summary (jumlah tugas dan tombol clear)
function updateSummary() {
  const totalItems = todoList.children.length;

  // hitung berapa yang belum dicentang
  const activeItems = Array.from(
    todoList.querySelectorAll(".form-check-input"),
  ).filter((checkbox) => !checkbox.checked).length;

  todoCount.innerText = `${activeItems} tugas tersisa`;

  // tampilkan tombol hapus semua jika ada minimal 1 tugas
  if (totalItems > 0) {
    clearAllBtn.classList.remove("d-none");
  } else {
    clearAllBtn.classList.add("d-none");
  }
}