let appRoot = document.querySelector("#app-root");

let container = document.createElement("div");
container.classList.add("app-container");

let h1 = document.createElement("h1");
h1.textContent = "NextUp List";
h1.classList.add("main-heading");

let counterDiv = document.createElement("div");
counterDiv.classList.add("counter-div")

let counterP = document.createElement("p");
counterP.setAttribute("id", "active-task-counter");
counterP.textContent = "Active Task : 0"

let counterP1 = document.createElement("p");
counterP1.setAttribute("id", "completed-task-counter");
counterP1.textContent = "Completed Task : 0"

let inputContainer = document.createElement("div");
inputContainer.classList.add("input-area")

let inputBox = document.createElement("input");
inputBox.setAttribute("type", "text")
inputBox.setAttribute("id", "input")
inputBox.setAttribute("placeholder", "add new something... ")
inputBox.classList.add("task-input")

// Task 28: Due date ke liye input field
let dateInput = document.createElement("input");
dateInput.setAttribute("type", "date");
dateInput.setAttribute("id", "date-input");
dateInput.classList.add("date-input");

let addBtn = document.createElement("button");
addBtn.textContent = "Add";
addBtn.classList.add("add-btn");
addBtn.setAttribute("id", "add-btn");

// Task 27: Search/Filter ke liye input field
let searchInput = document.createElement("input");
searchInput.setAttribute("type", "text");
searchInput.setAttribute("id", "search-input");
searchInput.setAttribute("placeholder", "Search tasks...");
searchInput.classList.add("task-input"); // Pehle se bani style class use ki
searchInput.style.marginBottom = "10px"; // Thodi space ke liye

let filterDiv = document.createElement("div");
filterDiv.classList.add("filter-buttons");

let all = document.createElement("button")
all.classList.add("filter-btn")
all.textContent = "All"

let activeBtn = document.createElement("button")
activeBtn.classList.add("filter-btn")
activeBtn.textContent = "Active"

let completedBtn = document.createElement("button");
completedBtn.classList.add("filter-btn")
completedBtn.textContent = "Completed"

let clearTaskDiv = document.createElement("div")
clearTaskDiv.classList.add("clear-task-div", "hidden")

let clearCompltedTask = document.createElement("button")
clearCompltedTask.textContent = "Clear completed Task";
clearCompltedTask.classList.add("clear-completed-btn", "clear-btn");

let clearAllTask = document.createElement("button")
clearAllTask.textContent = "Clear All Task ";
clearAllTask.classList.add("clear-all-btn", "clear-btn");

let ulList = document.createElement("ul")
ulList.classList.add("task-list")
ulList.setAttribute("id", "task-list")

// Task 30: Jab list khaali ho tab message dikhane ke liye
let emptyMsg = document.createElement("p");
emptyMsg.textContent = "No tasks yet! Add one above.";
emptyMsg.classList.add("empty-message", "hidden"); // Shuru mein hide rakha

// --- Elements ko Jodna ---
counterDiv.appendChild(counterP)
counterDiv.appendChild(counterP1)

inputContainer.appendChild(inputBox);
inputContainer.appendChild(dateInput); // Date input ko add kiya
inputContainer.appendChild(addBtn);

filterDiv.appendChild(all);
filterDiv.appendChild(activeBtn);
filterDiv.appendChild(completedBtn);

clearTaskDiv.appendChild(clearCompltedTask)
clearTaskDiv.appendChild(clearAllTask)

container.appendChild(h1);
container.appendChild(counterDiv);
container.appendChild(inputContainer);
container.appendChild(searchInput); // Search input ko add kiya
container.appendChild(filterDiv);
container.appendChild(clearTaskDiv)
container.appendChild(ulList);
container.appendChild(emptyMsg); // Empty message ko add kiya

appRoot.appendChild(container)


// Task 30 (Refactor): Naya function jo task element banata hai
function createTaskElement(taskText, taskDate, isCompleted) {
    let li = document.createElement("li");
    li.classList.add("task-item");
    li.setAttribute("draggable", "true");

    // Agar task pehle se completed hai (data load karte waqt)
    if (isCompleted) {
        li.classList.add("completed");
    }

    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.classList.add("task-text")

    let editInput = document.createElement("input")
    editInput.type = ("text");
    editInput.classList.add("edit-input", "hidden");

    let deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.textContent = "Delete";

    li.appendChild(taskSpan);
    li.appendChild(editInput);

    // Task 28: Date ko add karna
    if (taskDate) {
        let dateSpan = document.createElement("span");
        dateSpan.classList.add("task-date");
        dateSpan.textContent = taskDate;
        li.appendChild(dateSpan); // Delete button se pehle date daali

        // Overdue check karne ka logic
        checkOverdue(li, taskDate);
    }

    li.appendChild(deleteBtn);
    return li;
}

// Task 28: Overdue check karne ka logic
function checkOverdue(liElement, taskDate) {
    if (!taskDate) return;

    const today = new Date();
    const dateOfTask = new Date(taskDate);

    // Timezone issue se bachne ke liye time ko 0 set kiya
    today.setHours(0, 0, 0, 0);
    dateOfTask.setHours(0, 0, 0, 0); // Date ko compare karne ke liye zaroori

    if (dateOfTask < today) {
        liElement.classList.add("overdue");
    }
}

// Task 30: Empty message dikhane ka logic
function showEmptyMessage(show) {
    if (show) {
        emptyMsg.classList.remove("hidden");
    } else {
        emptyMsg.classList.add("hidden");
    }
}


function addTask() {
    const taskText = inputBox.value.trim();
    const taskDate = dateInput.value; // Task 28: Date ki value li

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Task 30 (Refactor): Naya function call kiya
    const li = createTaskElement(taskText, taskDate, false);
    ulList.appendChild(li);

    clearTaskDiv.classList.remove("hidden")

    inputBox.value = "";
    dateInput.value = ""; // Task 28: Date input ko clear kiya
    
    // Task 30 (UX Improvement): Input par wapas focus
    inputBox.focus(); 

    updateCounter();
    saveData(); // Task 26: Data save kiya
}

function clearTasks(selector) {
    const tasksToRemove = document.querySelectorAll(selector);
    tasksToRemove.forEach(function (task) {
        setTimeout(function () {
            task.remove();
            updateCounter();
            saveData(); // Task 26: Har remove ke baad save (aapke style ke hisaab se)
        }, 300);
    });
}


addBtn.addEventListener("click", addTask);

inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
        // updateCounter(); // Yahan zaroorat nahi, addTask ke andar ho raha hai
    }
})


ulList.addEventListener("click", function (event) {
    const clickedData = event.target;
    if (clickedData.classList.contains("delete-btn")) {
        
        // Task 29: Delete se pehle confirmation
        if (confirm("Are you sure you want to delete this task?")) {
            const parentLi = clickedData.parentElement
            parentLi.remove();
            updateCounter();
            saveData(); // Task 26: Data save kiya
        }

    }
    else if (clickedData.classList.contains("task-text")) {

        const parentLi = clickedData.parentElement;
        parentLi.classList.toggle("completed");
        updateCounter();
        saveData(); // Task 26: Data save kiya
    }

})

ulList.addEventListener("dblclick", function (event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("task-text")) {
        const parentLi = clickedElement.parentElement;
        const taskSpan = parentLi.querySelector(".task-text");
        const editInput = parentLi.querySelector(".edit-input")

        // Edit karte time purana text store karlo
        editInput.value = taskSpan.textContent;
        editInput.setAttribute("data-original-text", taskSpan.textContent);

        taskSpan.classList.add("hidden");
        editInput.classList.remove("hidden");

        editInput.focus();
    }
})


// Enter key se edit save
ulList.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && event.target.classList.contains("edit-input")) {
        // saveEdit(event.target); // Isse double alert aa sakta hai
        event.target.blur(); // Focus hata do, focusout listener kaam kar dega
    }
});

// Input se bahar click karne par edit save
ulList.addEventListener("focusout", function (event) {
    if (event.target.classList.contains("edit-input")) {
        saveEdit(event.target);
    }
});

// Edit save karne ka function
function saveEdit(inputElement) {
    const parentLi = inputElement.parentElement;
    const taskSpan = parentLi.querySelector(".task-text");
    const newText = inputElement.value.trim();

    // Task 29: Edit mein empty save na ho
    if (newText === "") {
        // Purana text waapas daal do
        taskSpan.textContent = inputElement.getAttribute("data-original-text");
    } else {
        taskSpan.textContent = newText;
    }

    inputElement.classList.add("hidden");
    taskSpan.classList.remove("hidden");
    saveData(); // Task 26: Edit ke baad data save
}

const activeTaskCounterEle = document.querySelector("#active-task-counter");
const completedTaskCounterEle = document.querySelector("#completed-task-counter");

function updateCounter() {
    const activeTask = document.querySelectorAll("li:not(.completed)");
    const completedTask = document.querySelectorAll("li.completed");

    const activeTaskCount = activeTask.length;
    const completedTaskCount = completedTask.length;

    activeTaskCounterEle.textContent = `Active Task : ${activeTaskCount}`
    completedTaskCounterEle.textContent = `Completed Task : ${completedTaskCount}`

    // Task 30: Empty message aur clear buttons ko check karo
    if (activeTaskCount === 0 && completedTaskCount === 0) {
        showEmptyMessage(true);
        clearTaskDiv.classList.add("hidden"); // Sab task clear hone par buttons hide karo
    } else {
        showEmptyMessage(false);
    }
}

clearTaskDiv.addEventListener("click", function (event) {
    const clickedEle = event.target;
    if (clickedEle.classList.contains("clear-completed-btn")) {
        clearTasks("li.completed");
    }
    else if (clickedEle.classList.contains("clear-all-btn")) {
        clearTasks("li.task-item");
    }

});


filterDiv.addEventListener("click", function (event) {
    const clickedFilter = event.target;
    if (clickedFilter.tagName === "BUTTON") {
        document.querySelectorAll(".filter-btn").forEach(function (btn) {
            btn.classList.remove("active");
        });
        clickedFilter.classList.add("active");

        const allTasks = document.querySelectorAll(".task-item");

        allTasks.forEach(function (task) {
            switch (clickedFilter.textContent) {
                case "Active":
                    task.style.display = task.classList.contains("completed") ? "none" : "flex";
                    break;
                case "Completed":
                    task.style.display = task.classList.contains("completed") ? "flex" : "none";
                    break;
                default: // All button
                    task.style.display = "flex";
                    break;
            }
        });
    }
});

// --- Task 26: Local Storage Functions ---
function saveData() {
    const tasks = [];
    const allTasks = document.querySelectorAll(".task-item");

    allTasks.forEach(function (taskLi) {
        const taskText = taskLi.querySelector(".task-text").textContent;
        const isCompleted = taskLi.classList.contains("completed");
        // Date ko bhi save karo
        const taskDateEl = taskLi.querySelector(".task-date");
        const taskDate = taskDateEl ? taskDateEl.textContent : "";

        tasks.push({
            text: taskText,
            date: taskDate,
            completed: isCompleted
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    // Check karo ki tasks null ya empty toh nahi hain
    if (tasks && tasks.length > 0) {
        tasks.forEach(function (task) {
            // Naya function use karke element banao
            const li = createTaskElement(task.text, task.date, task.completed);
            ulList.appendChild(li);
        });
        
        clearTaskDiv.classList.remove("hidden"); // Agar tasks hain toh buttons dikhao
    } else {
        // Task 30: Agar koi task save nahi hai toh empty message dikhao
        showEmptyMessage(true);
    }
}

// --- Task 27: Search Logic ---
searchInput.addEventListener("keyup", function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const allTasks = document.querySelectorAll(".task-item");

    allTasks.forEach(function (task) {
        // Task ka text lo
        const taskText = task.querySelector(".task-text").textContent.toLowerCase();
        
        // Check karo ki search term text mein hai ya nahi
        if (taskText.includes(searchTerm)) {
            task.style.display = "flex"; // Match ho toh dikhao
        } else {
            task.style.display = "none"; // Match na ho toh hide karo
        }
    });
});


// --- Drag and Drop (Aapka Code) ---
let draggingItem = null;

ulList.addEventListener("dragstart", function (event) {
    if (event.target.classList.contains("task-item")) {
        draggingItem = event.target;
        setTimeout(() => {
            draggingItem.classList.add("dragging");
        }, 0);
    }
});

ulList.addEventListener("dragend", function (event) {
    if (draggingItem) {
        draggingItem.classList.remove("dragging");
        draggingItem = null;
        saveData(); // Task 26: Order change hone par save karo
    }
});

ulList.addEventListener("dragover", function (event) {
    event.preventDefault();
    const afterElement = getDragAfterElement(ulList, event.clientY);

    if (afterElement == null) {
        ulList.appendChild(draggingItem);
    } else {
        ulList.insertBefore(draggingItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- Page Load ---
// Jab poora HTML load ho jaaye, tab data load karo
document.addEventListener("DOMContentLoaded", function () {
    loadData();
    updateCounter(); // Counter ko bhi update karo
});