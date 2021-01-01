const userInfo = document.querySelector('h1')
const avatarUser = document.querySelector('img')
let user = undefined

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
            'Content-Type': 'application/json',
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

getUserInfo()
getUserAvatar()