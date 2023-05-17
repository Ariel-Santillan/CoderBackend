const form = document.getElementById('recoverForm')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const password = document.getElementById('password').value
  fetch('/api/sessions/reset-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((result) => result.json())
    .then((json) => {
      console.log(json)
      if (json.status == 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Se ha enviado un mail',
          text: 'Abrelo para poder reestablecer tu contraseña',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops, the credentials arent valid',
          text: json.message || 'Verify your email and password',
        })
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops, the credentials arent valid',
        text: json.message || 'Verify your email and password',
      })
    })
})
