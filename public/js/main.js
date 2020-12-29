const userInfo = document.querySelector('h1')
const avatarUser = document.querySelector('img')
let user = undefined
const taskList = document.querySelector('ul')

let taskDescriptions = []
//const logoutAllButton = document.querySelector('#logoutAllButton')
const addTaskButton = document.querySelector('#addTaskButton')
const logoutButton = document.querySelector('#logoutButton')

const cookies = document.cookie
const token = cookies.substring(cookies.indexOf('token')+6)



window.onload = function(){
    if (token.length < 50){
        location.href = '/login.html'
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
            console.log(images)
        
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

function getUserTasks(){
    fetch('/tasks', {
        method: 'get',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }).then((res)=>{
        res.json().then((tasks)=>{
            tasks.forEach((task)=>{
                taskDescriptions.push(task.description)
                const li = document.createElement('li')
                li.innerHTML = task.description
                taskList.appendChild(li)
            })
        })
    })
}

// logoutAllButton.addEventListener('click', (e)=>{
//     e.preventDefault()
//     if(confirm('Are you sure')){
//         fetch('/users/logoutAll', {
//             method: 'post',
//             headers:{
//                 'Content-Type': 'application/json',
//                 'Authorization': token
//             }
//         }).then((res)=>{
//             document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
//             location.href = '/login.html'
//         })
//     }
// })

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
            location.href = '/login.html'
        })
    }
})

getUserInfo()
getUserTasks()