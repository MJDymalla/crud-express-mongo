
const messageDiv = document.querySelector('#message');
const deleteButton = document.querySelector('#delete-button');
deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Jacky Moon'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        if (response === 'No quote to delete') {
            messageDiv.textContent = 'No quote to delete'
        } else {
            window.location.reload();
        }
    })
})