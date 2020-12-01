const root = document.getElementById("wrapper")
const backendUrl = "http://localhost:3000/"
const finder = document.getElementById("finder")
const taskList = document.getElementById("task-list")
const footer = document.getElementById("footer")

document.addEventListener("DOMContentLoaded", e => {


    const onClickHandler = () => {
        document.addEventListener('click', e => {
            if (e.target.classList.value === "folder") {
                pullFolderTasks(e)
            } else if (e.target.id === "add-folder") {
                addFolder()
            } else if (e.target.id === "delete-folder") {
                deleteFolder(e)
            } else if (e.target.id === 'add-task-button') {
                renderAddTaskForm(e)
            }
            // } else {
            //     if (document.getElementById("add-folder-wrapper")) {
            //         footer.removeChild(document.getElementById("add-folder-wrapper"))
            //     }
            // }
        })
    }

    const onSubmitHandler = () => {
        document.addEventListener('submit', e =>{
            e.preventDefault()

            if (e.target.id === "new-folder-form") {
                postNewFolder(e)
            } else if (e.target.id === "task-form") {
                postNewTask(e)
            }

        })
    }

    const pullFolderData = () => {
        fetch(backendUrl + "folders/")
            .then(res => res.json())
            .then(folders => folders.map(folder => renderFolders(folder)))
    }

    const renderFolders = (folder) => {
        const folderDiv = document.createElement('div')
        folderDiv.className = "folder"
        folderDiv.innerHTML = `<div id="folder-name-text">${folder.name}</div><button id="delete-folder">X</button>`
        folderDiv.dataset.id = folder.id
        folderDiv.dataset.name = folder.name
        finder.appendChild(folderDiv)
    }

    const pullFolderTasks = (e) => {
        const folderId = e.target.dataset.id
        taskList.dataset.id = folderId

        if (document.getElementById("add-task-div")) {
            taskList.removeChild(document.getElementById("add-task-div"))
        }

        const addTaskButton = document.createElement("div")
        addTaskButton.dataset.id = folderId
        addTaskButton.id = "add-task-div"
        addTaskButton.innerHTML = `<button id="add-task-button">Add Task</button><div>${e.target.dataset.name} Tasks</div>`
        taskList.appendChild(addTaskButton)

        const packet = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            }
        }
        fetch(backendUrl + "folders/" + folderId, packet)
            .then(res => res.json())
            .then(folder => folder.tasks.map(task => renderTasks(task)))
    }

    const renderTasks = (task) => {
        console.log(task)
    }

    const addFolder = () => {
        const footer = document.getElementById("footer")
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
            <input name="name" type="text" placeholder="Folder Name">
            <input name="new-folder-submit" type="submit">
            `
            addFolderWrapper.appendChild(addFolderForm)
            footer.appendChild(addFolderWrapper)
        }
    }

    const postNewFolder = (e) => {
        footer.removeChild(document.getElementById("add-folder-wrapper"))

        const folderName = e.target.querySelector("input[name='name']").value
        const data = {
            name: folderName
        }
        const packet = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json",
            },
            body: JSON.stringify(data)
        }
        fetch(backendUrl + "folders/", packet)
            .then(res => res.json())
            .then(folder => renderFolders(folder))
    }

    const postNewTask = (e) => {
        const folder_id = e.target.parentElement.dataset.id

        const data = {
            date: e.target.date.value,
            name: e.target.name.value,
            notes: e.target.notes.value,
            folder_id: folder_id
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
            .then(console.log)
    }

    const deleteFolder = (e) => {
        const id = e.target.parentElement.dataset.id

        const packet = {
            method: "DELETE"
        }
        fetch(backendUrl + "/folders/" + id, packet)
            .then(res => res.json())
            .then(() => {
                finder.removeChild(e.target.parentElement)
            })
    }

    const renderAddTaskForm = (e) => {
        if (document.getElementById("task-form")) {
            taskList.removeChild(document.getElementById("task-form"))
        }
        const folderId = e.target.parentElement.dataset.id
        const form = document.createElement("form")
        form.innerHTML = `
            <input type="date" name="date" placeholder="Date"/>
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="notes" placeholder="Notes">
            <input type="submit">
        `
        form.id = "task-form"
        taskList.appendChild(form)
    }


    onSubmitHandler()
    onClickHandler()
    pullFolderData()


})