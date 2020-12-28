const regForm = document.querySelector('#createUserForm')


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
    }).then((data)=>{
        console.log(data)
        location.href = 'main.html?token=' + data.token
    }).catch((e)=>{
        console.log(e)
    })
})
