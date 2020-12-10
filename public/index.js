const root = document.getElementById("wrapper")
const backendUrl = "http://localhost:3000/"
const finder = document.getElementById("folder-finder")
const taskFinder = document.getElementById("task-finder")
const taskList = document.getElementById("task-list")
const footer = document.getElementById("footer")

document.addEventListener("DOMContentLoaded", e => {

    const onClickHandler = () => {
        document.addEventListener('click', e => {
            if (e.target.className === "folder" || e.target.className === "folder-selected") {
                clearSelections()
                e.target.id = "folder-selected"
                pullFolderTasks(e.target.dataset.id)
            } else if (e.target.id === "add-folder") {
                addFolder()
            } else if (e.target.className === "delete-folder") {
                deleteObject(e, "folders", document.getElementById("folder-finder"))
            } else if (e.target.className === "delete-task") {
                deleteObject(e, 'tasks', document.getElementById("task-list"))
            } else if (e.target.id === "add-task-button") {
                postNewTask(e)
            } else if (e.target.id === "add-task-name") {
                try { } catch (err) { ; }
            } else if (e.target.className === "task-name"){
                if (document.getElementById("task-selected")) {
                    const selectedTask = document.getElementById("task-selected")
                    selectedTask.id = "task"
                }
                e.target.id = "task-selected"
                pullTaskData(e)

            //ignore list
            } else if (e.target.id === "task-attribute-finder" ||
                e.target.id === "task-attribute-name" ||
                e.target.id === "task-finder" ||
                e.target.className === "task-input") {
                console.log("tendies")
            } else {
                clearSelections()
            }
        })
    }

    const onSubmitHandler = () => {
        document.addEventListener('submit', e =>{
            e.preventDefault()
            if (e.target.id === "new-folder-form") {
                postNewFolder(e)
            } else if (e.target.id === "task-patch-form") {
                patchTask(e)
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
        fetch(backendUrl + "folders/" + folderId, packet)
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
        taskDelete.textContent = "X"

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
        const folderId = e.target.parentElement.parentElement.dataset.id

        const data = {
            date: new Date(),
            name: e.target.parentElement.name.value,
            notes: '',
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
            .then(res => res.json())
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
        const wrapper = document.getElementById("wrapper")
        wrapper.style.gridTemplateColumns = "1fr 1fr 1fr"

        if (document.getElementById("task-attribute-finder")) {
            const taskAttributeFinder = document.getElementById("task-attribute-finder")
            wrapper.removeChild(taskAttributeFinder)
        }
        const taskAttributeFinder = document.createElement("div")
        taskAttributeFinder.id = "task-attribute-finder"
        wrapper.appendChild(taskAttributeFinder)

        const taskAttributeForm = document.createElement('form')
        taskAttributeForm.className = "task-patch-form"
        taskAttributeFinder.appendChild(taskAttributeForm)

        const taskAttributeTitle = document.createElement("input")
        taskAttributeTitle.id = "task-attribute-name"
        taskAttributeTitle.className = "task-input"
        taskAttributeTitle.type = "text"
        taskAttributeTitle.name = "task-name"
        taskAttributeTitle.placeholder = "Name"
        taskAttributeTitle.value = task.name

        const taskAttributeDate = document.createElement("input")
        taskAttributeDate.id = "task-attribute-date"
        taskAttributeDate.className = "task-input"
        taskAttributeDate.type = "date"
        taskAttributeDate.name = "task-date"
        taskAttributeDate.placeholder = "Date"
        taskAttributeDate.value = task.date

        const taskAttributeNotes = document.createElement("input")
        taskAttributeNotes.id = "task-attribute-notes"
        taskAttributeNotes.className = "task-input"
        taskAttributeNotes.type = "text"
        taskAttributeNotes.name = "task-notes"
        taskAttributeNotes.placeholder = "Notes"
        taskAttributeNotes.value = task.notes

        const taskAttributeStatus = document.createElement("select")
        taskAttributeStatus.id = "task-attribute-status"
        taskAttributeStatus.className = "task-input"
        taskAttributeStatus.name = "task-status"
        taskAttributeStatus.value = task.status

        const optionNotCompleted = document.createElement("option")
        optionNotCompleted.value = "not completed"
        optionNotCompleted.innerText = "Not Completed"

        const optionCompleted = document.createElement("option")
        optionCompleted.value = "completed"
        optionCompleted.innerText = "Completed"

        taskAttributeStatus.append(optionNotCompleted)
        taskAttributeStatus.append(optionCompleted)

        const optionSubmit = document.createElement("input")
        optionSubmit.type = "submit"
        optionSubmit.id = "task-attribute-submit"
        optionSubmit.value = "Save"

        taskAttributeForm.appendChild(taskAttributeTitle)
        taskAttributeForm.appendChild(document.createElement("br"))
        taskAttributeForm.appendChild(taskAttributeDate)
        taskAttributeForm.appendChild(document.createElement("br"))
        taskAttributeForm.appendChild(taskAttributeNotes)
        taskAttributeForm.appendChild(document.createElement("br"))
        taskAttributeForm.appendChild(taskAttributeStatus)
        taskAttributeForm.appendChild(document.createElement("br"))
        taskAttributeForm.appendChild(optionSubmit)
    }

    const patchTask = (e) => {
        console.log(e.target)
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
            const wrapper = document.getElementById("wrapper")
            const taskAttributeFinder = document.getElementById("task-attribute-finder")
            wrapper.removeChild(taskAttributeFinder)
            wrapper.style.gridTemplateColumns = "1fr 1fr"
        }
    }


    onSubmitHandler()
    onClickHandler()
    pullFolderData()

})