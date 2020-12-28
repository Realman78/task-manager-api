const userInfo = document.querySelector('h1')
const avatarUser = document.querySelector('img')
let user = undefined
const taskList = document.querySelector('ul')
const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token')
let taskDescriptions = []
const logoutButton = document.querySelector('#logoutButton')



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
        console.log(user)
        if(user.avatar){
            getUserAvatar(user._id)
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
            console.log(taskDescriptions)
        })
    })
}

logoutButton.addEventListener('click', (e)=>{
    e.preventDefault()
    if(confirm('Are you sure')){
        fetch('/users/logoutAll', {
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }).then((res)=>{
            location.href = '/login.html'
        })
    }
})

getUserInfo()
getUserTasks()