const loginForm = document.querySelector('#loginUserForm')


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
    }).then((data)=>{
        console.log(data)
        location.href = 'main.html?token=' + data.token
    }).catch((e)=>{
        console.log(e)
    })
})