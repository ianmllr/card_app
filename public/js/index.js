const socket = io();

// DOM Elements
const createBtn = document.getElementById('createBtn');
const usernameInput = document.getElementById('username');
const lobbyNameInput = document.getElementById('lobbyName');
const isPrivateCheckbox = document.getElementById('isPrivate');
const passwordContainer = document.getElementById('passwordContainer');
const lobbyPasswordInput = document.getElementById('lobbyPassword');


// show/hide password field based on checkbox
if (isPrivateCheckbox) {
    isPrivateCheckbox.addEventListener('change', () => {
        if (isPrivateCheckbox.checked) {
            passwordContainer.style.display = 'block';
        } else {
            passwordContainer.style.display = 'none';
            lobbyPasswordInput.value = ''; // clears password if unchecked
        }
    });
}

// event listeners
if (createBtn) {
    createBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const lobbyName = lobbyNameInput.value.trim();
        const isPrivate = isPrivateCheckbox.checked;
        const password = lobbyPasswordInput.value.trim();


        if (!username || !lobbyName) {
            alert('Please enter both a username and a lobby name.');
            return;
        }

        if (isPrivate) {
            if (!password || password.length !== 4) {
                alert('Please enter a valid 4-digit code for the private lobby.');
                return;
            }
        }

        socket.emit('create_lobby', {username, lobbyName, isPrivate, password});
    });
}

// socket
socket.on('lobby_created', (data) => {
    console.log('Lobby created successfully:', data);

    sessionStorage.setItem('lobbyId', data.lobbyId);
    sessionStorage.setItem('lobbyName', data.name);
    sessionStorage.setItem('username', usernameInput.value);

    // redirect to  game page
    window.location.href = 'game.html';
});

socket.on('error', (data) => {
    console.error('Socket error:', data);
    alert('Error: ' + data.message);
});
