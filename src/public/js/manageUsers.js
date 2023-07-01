const deleteUser = document.getElementById('DeleteUser')
const changeRole = document.getElementById('ChangeRol')
const userID = document.getElementById('UserId')


const userIDToModify = userID.value

deleteUser.addEventListener('click', () => {
  fetch(`/api/users/${userIDToModify}`, {
    method: 'DELETE',
  })
    .then((data) => {
      console.log('User deleted');
    })
    .catch((err) => {
      window.alert(err)
    })
})

deleteUser.addEventListener('click', () => {
  fetch(`/api/users/premium/${userIDToModify}`, {
    method: 'GET',
  })
    .then((data) => {
      console.log('User role modified');
    })
    .catch((err) => {
      window.alert(err)
    })
})