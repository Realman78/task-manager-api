const regForm = document.querySelector('#createUserForm')

const cookies = document.cookie
const token = cookies.substring(cookies.indexOf('token')+6)
window.onload = function(){
    if (token.length > 50){
        location.href = '/main'
    }
}

regForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const username = regForm[0].value
    const email = regForm[1].value
    const password = regForm[2].value

    const data = JSON.stringify({
        name: username,
        email,
        password
    })


    fetch('/users', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: data
    }).then((res)=>{
        console.log(res)
        return res.json()
    }).then((data2)=>{
        document.cookie = 'token=' + data2.token + ';expires=Thu, 18 Dec 2042 12:00:00 UTC;'
        location.href = '/main'
    }).catch((e2)=>{
        console.log(e2)
    })
})
