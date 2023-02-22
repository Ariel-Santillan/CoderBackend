const logout = document.getElementById('logout')

logout.addEventListener('click', () => {
  fetch('/api/sessions/logout', {
    method: 'GET',
  })
    .then((data) => {
      window.location.href = '/'
    })
})
