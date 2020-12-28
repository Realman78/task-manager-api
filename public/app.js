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
    })
})
