const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function generateId() {
  return +new Date();
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function generateTodoObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function addTodo() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookHasFinished = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookHasFinished
  );
  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeTodo(todoObject) {
  const elementBookTitle = document.createElement("h3");
  elementBookTitle.innerHTML = todoObject.title;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.innerText = todoObject.author;

  const elementBookYear = document.createElement("p");
  elementBookYear.innerText = todoObject.year;

  const descContainer = document.createElement("div");
  descContainer.append(elementBookTitle, elementBookAuthor, elementBookYear);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(descContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.textContent = "Belum selesai di Baca";
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.textContent = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(undoButton, trashButton);

    container.append(actionContainer);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.textContent = "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      completeTask(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.textContent = "Hapus buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(completeButton, trashButton);

    container.append(actionContainer);
  }

  return container;
}

function completeTask(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchTodo() {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredTodos = todos.filter((todo) => {
    const title = todo.title.toLowerCase();
    return title.includes(searchInput);
  });

  const uncompleted = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompleted.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const todoItem of filteredTodos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isComplete) {
      listCompleted.append(todoElement);
    } else {
      uncompleted.append(todoElement);
    }
  }
}

document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    searchTodo();
  });

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleted = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompleted.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isComplete) {
      listCompleted.append(todoElement);
    } else {
      uncompleted.append(todoElement);
    }
  }
});
