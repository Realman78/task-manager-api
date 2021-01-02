const loginForm = document.querySelector('#loginUserForm')

const cookies = document.cookie
const token = cookies.substring(cookies.indexOf('token')+6)
window.onload = function(){
    if (token.length > 50){
        location.href = '/main'
    }
}

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const email = loginForm[0].value
    const password = loginForm[1].value
    const data = JSON.stringify({
        email,
        password
    })

    fetch('/users/login', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: data
    }).then((res)=>{
        console.log(res)
        return res.json()
    }).then((data2)=>{
        console.log(data2)

        document.cookie = 'token=' + data2.token + ';expires=Thu, 18 Dec 2042 12:00:00 UTC;'
        
        location.href = '/main'
    }).catch((e2)=>{
        console.log(e2)
    })
})