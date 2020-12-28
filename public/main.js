const userInfo = document.querySelector('h1')

fetch('/users/me', {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer token'
    },
    
}).then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.log(e)
})

