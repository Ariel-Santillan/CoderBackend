const formRegister = document.getElementById('formRegister')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const password = document.getElementById('password')
const age = document.getElementById('age')

formRegister.addEventListener('submit', (e) => {
  e.preventDefault()
  fetch('/api/sessions/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      age: age.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.alert(`Usuario creado`)
      window.location.href = '/products'
    })
    .catch((err) => {
      window.alert('Error al crear usuario')
    })
})
