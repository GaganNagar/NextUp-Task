

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

let addBtn = document.createElement("button");
addBtn.textContent = "Add";
addBtn.classList.add("add-btn");
addBtn.setAttribute("id", "add-btn");

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
clearTaskDiv.classList.add("clear-task-div","hidden")


let clearCompltedTask = document.createElement("button")
clearCompltedTask.textContent = "Clear completed Task";
clearCompltedTask.classList.add("clear-completed-btn","clear-btn");


let clearAllTask = document.createElement("button")
clearAllTask.textContent = "Clear All Task ";
clearAllTask.classList.add("clear-all-btn","clear-btn");


let ulList = document.createElement("ul")
ulList.classList.add("task-list")
ulList.setAttribute("id", "task-list")

counterDiv.appendChild(counterP)
counterDiv.appendChild(counterP1)

inputContainer.appendChild(inputBox);
inputContainer.appendChild(addBtn);

filterDiv.appendChild(all);
filterDiv.appendChild(activeBtn);
filterDiv.appendChild(completedBtn);

clearTaskDiv.appendChild(clearCompltedTask)
clearTaskDiv.appendChild(clearAllTask)

container.appendChild(h1);
container.appendChild(counterDiv);
container.appendChild(inputContainer);
container.appendChild(filterDiv);
container.appendChild(clearTaskDiv)
container.appendChild(ulList);

appRoot.appendChild(container)



function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");  /// agar user ne space enter ki hogi to  vo trim ho jygi mean "" ho jygi
        return;
    }
    let li = document.createElement("li");
    li.classList.add("task-item");

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
    li.appendChild(editInput)
    li.appendChild(deleteBtn);
    ulList.appendChild(li);

    clearTaskDiv.classList.remove("hidden")

    inputBox.value = "";
    updateCounter();
}

function clearTasks(selector) {
    const tasksToRemove = document.querySelectorAll(selector);
    tasksToRemove.forEach(function(task) {
        setTimeout(function() {
            task.remove();
            updateCounter();
        }, 300);
    });
}


addBtn.addEventListener("click", addTask);

inputBox.addEventListener("keyup", function (event) {       //only for enter key press and call addTask()
    if (event.key === "Enter") {
        addTask();
        updateCounter();

    }

})


ulList.addEventListener("click", function (event) {
    const clickedData = event.target;    // puri html element kyuki target kiya hamne ki click kaha hua 
    if (clickedData.classList.contains("delete-btn")) {
        const parentLi = clickedData.parentElement
        parentLi.remove();
        updateCounter();
    }
    else if (clickedData.classList.contains("task-text")) {    //clickedData =puri html jispe click hua isliye attribute se check kar rhe

        const parentLi = clickedData.parentElement;
        parentLi.classList.toggle("completed");
        updateCounter();
        //      Iska matlab hai: "Jab li par task-item aur completed dono classes hon, tab uske andar jo span hai, uspar line-through laga do.
        //    matlab li k andr normal completed class nhi lgi but jb hm click krenge text par tb completed class lg jaygi to span ko target karengge jb lgegi"
    }

})

ulList.addEventListener("dblclick", function (event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("task-text")) {
        const parentLi = clickedElement.parentElement;
        const taskSpan = parentLi.querySelector(".task-text");
        const editInput = parentLi.querySelector(".edit-input")

        editInput.value = taskSpan.textContent;

        taskSpan.classList.add("hidden");
        editInput.classList.remove("hidden");

        editInput.focus();
    }
})




// Listener hai jo  Enter key press hone par edit save hoga
ulList.addEventListener("keyup", function (event) {
    // Check karein ki kya 'Enter' key dabi aur kya woh ek 'edit-input' field tha.
    if (event.key === "Enter" && event.target.classList.contains("edit-input")) {
        saveEdit(event.target);
    }
});

// Listener jo input se bahar click karne par edit save karega
ulList.addEventListener("focusout", function (event) {
    if (event.target.classList.contains("edit-input")) {
        saveEdit(event.target);
    }
});

// Ek alag function jo edit save karne ka kaam karega
function saveEdit(inputElement) {
    const parentLi = inputElement.parentElement;
    const taskSpan = parentLi.querySelector(".task-text");

    // Span ka text input ki nayi value se update kiya
    taskSpan.textContent = inputElement.value;

    // Input ko hide karein aur Span ko wapas show kiya
    inputElement.classList.add("hidden");
    taskSpan.classList.remove("hidden");
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
                default: // 
                    task.style.display = "flex";
                    break;
            }
        });
    }
});
