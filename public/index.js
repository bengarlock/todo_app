const root = document.getElementById("wrapper")
const backendUrl = "http://localhost:3000/"
const finder = document.getElementById("folder-finder")
const taskFinder = document.getElementById("task-finder")
const taskList = document.getElementById("task-list")
const footer = document.getElementById("footer")

document.addEventListener("DOMContentLoaded", e => {

    const onClickHandler = () => {
        document.addEventListener('click', e => {
            if (e.target.className === "folder") {
                if (document.getElementById("folder-selected")) {
                    const selectedDoc = document.getElementById("folder-selected")
                    selectedDoc.removeAttribute('id');
                    e.target.id = "folder-selected"
                }
                e.target.id = "folder-selected"
                pullFolderTasks(e.target.dataset.id)

            } else if (e.target.id === "add-folder") {
                addFolder()
            } else if (e.target.className === "delete-folder") {
                deleteFolder(e)
            } else if (e.target.id === "add-task-button") {
                postNewTask(e)
            } else if (e.target.className === "folder-name") {
                const parentNode = e.target.parentElement
                if (document.getElementById("folder-selected")) {
                    const selectedDoc = document.getElementById("folder-selected")
                    selectedDoc.removeAttribute('id');
                    e.target.id = "folder-selected"
                }
                parentNode.removeAttribute('id')
                parentNode.id = "folder-selected"
                pullFolderTasks(e.target.parentElement.dataset.id)
            }
        })
    }

    const onSubmitHandler = () => {
        document.addEventListener('submit', e =>{
            e.preventDefault()
            if (e.target.id === "new-folder-form") {
                postNewFolder(e)
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

    const pullFolderTasks = (folderId) => {
        const taskListHeader = document.getElementById("task-list-header")
        taskListHeader.dataset.id = folderId
        clearChildNodes(taskListHeader)
        clearChildNodes(taskList)

        const addTaskForm = document.createElement("form")
        addTaskForm.innerHTML = `
            <input type="text" name="name" id="add-task-name" autocomplete="off" placeholder="Add Task"/>
            <input type="submit" value="+" id="add-task-button" />
        `

        taskListHeader.appendChild(addTaskForm)

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
        const taskCard = document.createElement("ul")
        taskCard.dataset.id = task.id
        taskCard.className = "folder"

        taskCard.innerHTML = `
            <span>${task.name}</span><span id="delete-task">X</span>
        `
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
                <input id="submit" name="new-folder-submit" type="submit" value="+">
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
        const folder_id = e.target.parentElement.parentElement.dataset.id


        const data = {
            date: new Date(),
            name: e.target.parentElement.name.value,
            notes: '',
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
            .then(task => renderTasks(task))
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

    const clearChildNodes = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    onSubmitHandler()
    onClickHandler()
    pullFolderData()
})