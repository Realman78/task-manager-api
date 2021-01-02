const userInfo = document.querySelector('h1')
const avatarUser = document.querySelector('img')
let user = undefined
const taskList = document.querySelector('ol')

let taskObjects = []
const checkboxes = []
const addTaskButton = document.querySelector('#addTaskButton')
const logoutButton = document.querySelector('#logoutButton')

const cookies = document.cookie
const token = cookies.substring(cookies.indexOf('token')+6)

let lastEl = undefined

window.onload = function(){
    if (token.length < 50){
        location.href = '/login'
    }
}



function getUserAvatar(userID){
    fetch(`/users/${userID}/avatar`,{
        method: "GET",
        headers: {
            'Authorization': token
        }
    }).then(response => response.blob())
        .then(images => {
            if (!URL.createObjectURL(images)){
                avatarUser.remove()
            }else{
                avatarUser.src = URL.createObjectURL(images)
            }
        }).catch((e)=>{
            console.log(e)
        })
}


function getUserInfo(){
    fetch('/users/me', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        user = data
        userInfo.innerHTML = user.name
        if(user.avatar){
            getUserAvatar(user._id)
        }else{
            avatarUser.remove()
        }
    })
    .catch((e)=>{
        console.log(e)
    })
}

// taskList.onmouseover = (e)=>{
//     if (e.target.nodeName === 'LI'){
//         const index = taskObjects.findIndex((task)=>{
//             return task.description === e.target.innerText
//         })
//         console.log(taskList.children[index])
//         lastEl = taskList.children[index].id
//         // const li = taskList.children[index]
//         // const button = document.createElement('button')
//         // button.innerText = 'HEOk'
//         // li.appendChild(button)
//         // console.log(taskList.children[index])
//     }
// }

// taskList.onmouseleave = (e)=>{
//     // const ol = e.target.children
//     // const index = taskList.findIndex((li)=>{
//     //     return task.description === e.target.innerText
//     // })
//     // console.log(index)
//     console.log('ehokeofks' + lastEl)
// }

taskList.onclick = (e)=>{
    
    if (e.target.checked){
        console.log(e)
        
        const index = taskObjects.findIndex((task)=>{
            return task.description === e.path[1].id
        })
        const taskID = taskObjects[index]._id
        fetch(`/tasks/${taskID}`,{
            method: 'delete',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((res)=>{
            setTimeout(()=>{
                taskList.removeChild(e.path[1])
            },1000)
            
        })
    }
}

function getUserTasks(){
    taskList.innerHTML = ''
    fetch('/tasks', {
        method: 'get',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then((res)=>{
        res.json().then((tasks)=>{
            taskObjects = tasks
            tasks.forEach((task)=>{
                 const ch = document.createElement('input')
                 ch.type = 'checkbox'
                 ch.textContent = task.description
                 checkboxes.push(ch)
                 const li = document.createElement('li')
                 li.id = task.description
                 li.innerHTML = ch.outerHTML + ch.textContent
                 const button = document.createElement('button')
                 button.innerText = 'Edit task description'
                 button.addEventListener('click', (e)=>{
                     e.preventDefault()
                     const td = prompt('Enter the new task description')
                     if (td){
                        const bodyData = JSON.stringify({
                            description: td
                        })
                        const index = taskObjects.findIndex((task)=>{
                            return e.path[1].id === task.description
                        })
                        const tID = taskObjects[index]._id
                        fetch('/tasks/'+tID, {
                            method: 'PATCH',
                            headers:{
                                'Content-Type': 'application/json',
                                'Authorization': token
                            },
                            body: bodyData
                        }).then((res)=>{
                            getUserTasks()
                            //location.reload()
                        })
                     }
                     
                 })
                li.appendChild(button)
                 taskList.appendChild(li)
             })
        })
    })
}

//probaj sa divon

addTaskButton.addEventListener('click', (e)=>{
    e.preventDefault()
    const task = prompt('Enter the name of the task please')
    if (!task){
        return undefined
    }
    const bodyData = JSON.stringify({
        description: task
    })
    fetch('/tasks', {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: bodyData
    }).then((res)=>{
        res.json().then((data)=>{
            // const li = document.createElement('li')
            // li.innerHTML = data.description
            // taskList.appendChild(li)
            
            getUserTasks()
        })
    })
    
    
})

logoutButton.addEventListener('click', (e)=>{
    e.preventDefault()
    if (confirm('Are you sure you want to log out?')){
        fetch('/users/logout',{
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((res)=>{
            document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
            location.href = '/login'
        })
    }
})



getUserInfo()
getUserTasks()