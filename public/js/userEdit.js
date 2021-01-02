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



function getUserAvatar(){
    fetch(`/users/me/avatar`,{
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
            getUserAvatar()
        }else{
            avatarUser.remove()
        }
    })
    .catch((e)=>{
        console.log(e)
    })
}

avatarUser.onclick = function(e){
    
    e.preventDefault()
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 

    // getting a hold of the file reference
    var file = e.target.files[0]; 

    // setting up the reader
    var reader = new FileReader();
    reader.readAsDataURL(file); // this is reading as data url

    // here we tell the reader what to do when it's done reading...
    reader.onload = (readerEvent) => {    
        var content = readerEvent.target.result; // this is the content!
        var formData = new FormData();
        formData.append('avatar', content);

        // const XHR = new XMLHttpRequest()

        // XHR.open('POST', '/users/me/avatar')
        // XHR.setRequestHeader('Authorization', token)
        // XHR.setRequestHeader( 'Content-Type','multipart/form-data; boundary=blob' )
        // XHR.send(formData)
        fetch('/users/me/avatar',{
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': token,
                
                
            },
            
            
        }).then((res,a)=>{
            console.log(res +a)
            avatarUser.src = content
            return res.json()
        }).then((data)=>{
            console.log(data)
        })
        .catch((e)=>{
            console.log(e)
        })
        
    }
}
input.click()
}

getUserInfo()
getUserAvatar()