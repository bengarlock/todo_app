const root = document.getElementById("root")
const backendUrl = "http://localhost:3000/"

document.addEventListener("DOMContentLoaded", e => {

    const pullData = () => {
        fetch(backendUrl + "folders/")
            .then(res => res.json())
            .then(folders => folders.map(folder => renderFolders(folder)))
    }

    const renderFolders = (folder) => {
        const finder = document.getElementById("finder")
        const folderDiv = document.createElement('div')
        folderDiv.innerHTML = `<div class="folder">${folder.name}</div>`
        folderDiv.dataset.id = folder.id
        finder.appendChild(folderDiv)
    }

    const onClickHandler = () => {
        document.addEventListener('click', e => {
            if (e.target.classList.value === "folder") {
                renderFolderTasks(e)
            } else if (e.target.id === "add-folder") {
                add
            }
        })
    }

    const renderFolderTasks = (e) => {
        const foderDiv = e.target
    }


    pullData()
    onClickHandler()

})