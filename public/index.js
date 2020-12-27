const root = document.getElementById("wrapper")
const backendUrl = "https://bengarlock.com:8080/"
const finder = document.getElementById("folder-finder")
const taskFinder = document.getElementById("task-finder")
const taskList = document.getElementById("task-list")
const footer = document.getElementById("footer")

document.addEventListener("DOMContentLoaded", e => {

    const onClickHandler = () => {

        document.addEventListener('click', e => {

            if (e.target.className === "folder" ||
                e.target.className === "folder-selected") {
                clearSelections()
                e.target.id = "folder-selected"
                pullFolderTasks(e.target.dataset)
            } else if (e.target.className === "folder-name") {
                clearSelections()
                e.target.parentElement.id = "folder-selected"
                pullFolderTasks(e.target.parentElement.dataset)
            } else if (e.target.id === "add-folder") {
                addFolder()
            } else if (e.target.className === "delete-folder") {
                deleteObject(e, "folders", document.getElementById("folder-finder"))
            } else if (e.target.className === "delete-task") {
                deleteObject(e, 'tasks', document.getElementById("task-list"))
            } else if (e.target.id === "add-task-button") {
                postNewTask(e)
            } else if (e.target.className === "task-name") {
                if (document.getElementById("task-selected")) {
                    const selectedTask = document.getElementById("task-selected")
                    selectedTask.id = "task"
                }
                e.target.parentElement.id = "task-selected"
                pullTaskData(e)
            } else if (e.target.id === "task-list") {
                if (document.getElementById("task-selected")) {
                    const taskSelected = document.getElementById("task-selected")
                    taskSelected.id = "task"

                    const taskAttributeFinder = document.getElementById("task-attribute-finder")
                    while (taskAttributeFinder.firstChild) {
                        taskAttributeFinder.removeChild(taskAttributeFinder.lastChild)
                    }
                }
                if (document.getElementById("add-folder-wrapper")) {
                    const footer = document.getElementById("footer")
                    const addFolderWrapper = document.getElementById("add-folder-wrapper")
                    footer.removeChild(addFolderWrapper)
                }
            } else if (e.target.id === "add-folder-button") {
                postNewFolder(e)
            } else if (e.target.id === "task-attribute-finder" ||
                e.target.id === "task-attribute-name" ||
                e.target.id === "task-finder" ||
                e.target.id === "add-task-name" ||
                e.target.type === "text" ||
                e.target.id === "task-patch-form" ||
                e.target.className === "task-input") {
            } else if (e.target.id === "task-patch-submit") {
                patchTask(e)
            } else {
                clearSelections()
            }
        })
    }

    const pullFolderData = () => {
        fetch(backendUrl + "folders/")
            .then(res => res.json())
            .then(folders => folders.map(folder => renderFolders(folder)))
    }

    const renderFolders = (folder) => {
        const folderDiv = document.createElement('ul')
        folderDiv.className = "folder"

        const folderDivName = document.createElement("span")
        folderDivName.className = "folder-name"
        folderDivName.dataset.id = folder.id
        folderDivName.innerHTML = `${folder.name}`

        const folderDivDelete = document.createElement("span")
        folderDivDelete.className = "delete-folder"
        folderDivDelete.innerHTML = "X"

        folderDiv.appendChild(folderDivName)
        folderDiv.appendChild(folderDivDelete)

        folderDiv.dataset.id = folder.id
        folderDiv.dataset.name = folder.name
        finder.appendChild(folderDiv)
    }

    const pullFolderTasks = (folder) => {
        const folderTitle = document.getElementById("folder-title")
        folderTitle.innerText = folder.name

        const taskListHeader = document.getElementById("task-list-header")
        taskListHeader.dataset.id = folder.id

        const addTaskForm = document.createElement("form")
        addTaskForm.id = "add-task-form"

        const inputName = document.createElement("input")
        inputName.type = "text"
        inputName.name = "name"
        inputName.id = "add-task-name"
        inputName.autocomplete = "off"
        inputName.placeholder = "Add Task"

        const inputSubmit = document.createElement("input")
        inputSubmit.value = "+"
        inputSubmit.id = "add-task-button"
        inputSubmit.type = "submit"

        addTaskForm.appendChild(inputName)
        addTaskForm.appendChild(inputSubmit)

        taskListHeader.appendChild(addTaskForm)

        const packet = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            }
        }
        fetch(backendUrl + "folders/" + folder.id, packet)
            .then(res => res.json())
            .then(folder => folder.tasks.map(task => renderTasks(task)))
    }

    const renderTasks = (task) => {
        const taskCard = document.createElement("div")
        taskCard.dataset.id = task.id
        taskCard.className = "task"

        const taskName = document.createElement("span")
        taskName.className = "task-name"
        taskName.dataset.id = task.id
        taskName.textContent = task.name

        const taskDelete = document.createElement("span")
        taskDelete.className = "delete-task"
        taskDelete.innerHTML = "X"

        taskCard.appendChild(taskName)
        taskCard.appendChild(taskDelete)
        taskList.appendChild(taskCard)
    }

    const addFolder = () => {
        const addFolderWrapper = document.getElementById('add-folder-wrapper')
        if (addFolderWrapper) {
            footer.removeChild(addFolderWrapper)
        } else {
            const addFolderWrapper = document.createElement('div')
            addFolderWrapper.id = "add-folder-wrapper"
            // addFolderWrapper.innerHTML = `<div id="arrow-down"></div>`

            const addFolderForm = document.createElement('form')
            addFolderForm.id = "new-folder-form"
            addFolderForm.innerHTML = `
                <input id="name" autocomplete="off" name="name" type="text" placeholder="Folder Name">
                <input id="add-folder-button" type="submit" value="+">
            `
            addFolderWrapper.appendChild(addFolderForm)
            footer.appendChild(addFolderWrapper)
        }
    }

    const postNewFolder = (e) => {
        footer.removeChild(document.getElementById("add-folder-wrapper"))
        const form = e.target.parentElement
        const folderName = form.name.value

        const data = {
            name: folderName
        }
        const packet = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(backendUrl + "folders/", packet)
            .then(res => res.json())
            .then(folder => renderFolders(folder))
    }

    const postNewTask = (e) => {
        e.preventDefault()
        const folderId = e.target.parentElement.parentElement.dataset.id
        const form = e.target.parentElement
        const name = form.name.value

        form.reset()

        const data = {
            date: new Date(),
            name: name,
            folder_id: folderId
        }

        const packet = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(backendUrl + "tasks/", packet)
            .then(res => res.json())
            .then(task => renderTasks(task))
    }

    const deleteObject = (e, folder, finder) => {
        const id = e.target.parentElement.dataset.id
        const packet = {
            method: "DELETE"
        }
        fetch(backendUrl + folder + "/" + id, packet)
            .then(() => {
                finder.removeChild(e.target.parentElement)
            })
    }

    const pullTaskData = (e) => {
        const packet = {
            method: "GET",
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            }
        }

        fetch(backendUrl + "tasks/" + e.target.dataset.id, packet)
            .then(res => res.json())
            .then(task => renderTaskAttributeFinder(task))
    }

    const renderTaskAttributeFinder = (task) => {
        console.log(task.date)
        const formatDate = (date) => {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;

            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }
        formatDate(task.date)

        const wrapper = document.getElementById("wrapper")
        wrapper.style.gridTemplateColumns = "minmax(200px, 300px) 1fr 1fr"

        if (document.getElementById("task-attribute-finder")) {
            const taskAttributeFinder = document.getElementById("task-attribute-finder")
            wrapper.removeChild(taskAttributeFinder)
        }
        const taskAttributeFinder = document.createElement("div")
        taskAttributeFinder.id = "task-attribute-finder"
        taskAttributeFinder.dataset.id = task.id
        wrapper.appendChild(taskAttributeFinder)

        const taskAttributeForm = document.createElement('form')
        taskAttributeForm.id = "task-patch-form"
                taskAttributeForm.innerHTML = `
            <input name="name" class="task-input" type="text" value="${task.name}" autocomplete="off" placeholder="Name" required ><br />
            <input name="date" class="task-input" type="date" value="${formatDate(task.date)}" placeholder="Date" ><br >
            <input name="notes" class="task-input" type="text" value="${task.notes}" autocomplete="off" placeholder="Notes"><br />
            <select name="status" class="task-input" type="select"><br />
                ${renderStatusDropdown(task.status)}
            </select><br />
            <input id="task-patch-submit" type="submit" value="Save">
        `
        taskAttributeFinder.appendChild(taskAttributeForm)
    }

    const renderStatusDropdown = (status) => {
        if (status === "completed") {
            return (
            `<option value="not-completed">Not Completed</option>
            <option value="completed" selected="selected">Completed</option>`
            )
        } else {
            return (
                `<option value="not-completed" selected="selected" >Not Completed</option>
                <option value="completed">Completed</option>`
            )
        }
    }

    const patchTask = (e) => {
        e.preventDefault()
        const form = e.target.parentElement
        const taskId = form.parentElement.dataset.id

        const data = {
            name: form.name.value,
            date: form.date.value + " 06:00",
            notes: form.notes.value,
            status: form.status.value,
        }

        const packet = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch(backendUrl + "tasks/" + taskId + '/', packet)
            .then(res => res.json())
            .then(console.log)
    }

    const clearSelections = () => {

        if (document.getElementById("folder-selected")) {
            const selectedDoc = document.getElementById("folder-selected")
            selectedDoc.removeAttribute('id');
        }
        if (document.getElementById("task-list-header").firstChild) {
            const taskListHeader = document.getElementById("task-list-header")
            while (taskListHeader.firstChild) {
                taskListHeader.removeChild(taskListHeader.lastChild)
            }
        }
        if (document.getElementById("task-list").firstChild) {
            const taskList = document.getElementById("task-list")
            while (taskList.firstChild) {
                taskList.removeChild(taskList.lastChild)
            }
        }
        if (document.getElementById("task-attribute-finder")) {
            const taskAttributeFinder = document.getElementById("task-attribute-finder")
            root.removeChild(taskAttributeFinder)
            root.style.gridTemplateColumns = "minmax(200px, 300px) 1fr"
        }
        if (document.getElementById("add-folder-wrapper")) {
            const footer = document.getElementById("footer")
            const addFolderWrapper = document.getElementById("add-folder-wrapper")
            footer.removeChild(addFolderWrapper)
        }
        // if (document.getElementById("folder-title")) {
        //     const folderTitle = document.getElementById("folder-title")
        //     folderTitle.remove()
        // }


    }

    onClickHandler()
    pullFolderData()

})