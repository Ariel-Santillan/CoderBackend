const socket = io()
const chatsList = document.getElementById('chats-list')

socket.on('init-chats', ({ messages }) => {
  messages.forEach((message) => {
    chatsList.innerHTML += `<li>${message.user} - ${message.message}</li>`
  })
})

socket.on('add-message', (newMessage) => {
  chatsList.innerHTML += `<li>${newMessage.username} - ${newMessage.message}</li>`
})
