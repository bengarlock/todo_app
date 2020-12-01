const root = document.getElementById("wrapper")
const backendUrl = "http://localhost:3000/"
const finder = document.getElementById("finder")

document.addEventListener("DOMContentLoaded", e => {

    const pullData = () => {
        fetch(backendUrl + "folders/")
            .then(res => res.json())
            .then(folders => folders.map(folder => renderFolders(folder)))
    }

    const renderFolders = (folder) => {
        const folderDiv = document.createElement('div')
        folderDiv.className = "folder"
        folderDiv.innerHTML = `<div id="folder-name-text">${folder.name}</div><button id="delete-folder">X</button>`
        folderDiv.dataset.id = folder.id
        finder.appendChild(folderDiv)
    }

    const onClickHandler = () => {
        document.addEventListener('click', e => {
            if (e.target.classList.value === "folder") {
                renderFolderTasks(e)
            } else if (e.target.id === "add-folder") {
                addFolder()
            } else if (e.target.id === "delete-folder") {
                deleteFolder(e)
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

    const renderFolderTasks = (e) => {
        const folderId = e.target.dataset.id
        const packet = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            }
        }
        fetch(backendUrl + "folders/" + folderId, packet)
            .then(res => res.json())
            .then(console.log)

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




    pullData()
    onClickHandler()
    onSubmitHandler()

})