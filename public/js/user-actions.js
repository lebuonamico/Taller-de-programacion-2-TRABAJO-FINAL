const apiBase = '/api/users'

const showMessage = (message, type = 'success') => {
    const messageEl = document.getElementById('message')
    if (!messageEl) return

    if (Array.isArray(message)) {
        message = message.join('\n')
    } else if (typeof message === 'object' && message !== null) {
        message = JSON.stringify(message, null, 2)
    }

    messageEl.textContent = message
    messageEl.className = `message ${type}`
}

const showToken = token => {
    const tokenResult = document.getElementById('tokenResult')
    const tokenOutput = document.getElementById('tokenOutput')
    if (!tokenResult || !tokenOutput) return

    tokenOutput.value = token
    tokenResult.classList.remove('hidden')
}

const hideToken = () => {
    const tokenResult = document.getElementById('tokenResult')
    const tokenOutput = document.getElementById('tokenOutput')
    if (!tokenResult || !tokenOutput) return

    tokenOutput.value = ''
    tokenResult.classList.add('hidden')
}

const requestJson = async (url, options) => {
    const response = await fetch(url, options)
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
        const error = new Error(data.error || 'Error en la petición')
        error.details = data.detalles || data.details
        throw error
    }
    return data
}

const handleLogin = async event => {
    event.preventDefault()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()

    try {
        const data = await requestJson(`${apiBase}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        hideToken()
        showMessage('Inicio de sesión exitoso', 'success')
        showToken(data.token)
    } catch (error) {
        hideToken()
        showMessage(error.details || error.message, 'error')
    }
}

const handleRegister = async event => {
    event.preventDefault()
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()

    try {
        const data = await requestJson(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        showMessage(`Usuario registrado: ${data.name} (${data.email})`, 'success')
    } catch (error) {
        showMessage(error.details || error.message, 'error')
    }
}

const handleGetProfile = async event => {
    event.preventDefault()
    const token = document.getElementById('token').value.trim()

    try {
        const data = await requestJson(`${apiBase}/profile`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        })
        showMessage(`ID: ${data.id} | ${data.name} | ${data.email}`, 'success')
    } catch (error) {
        showMessage(error.details || error.message, 'error')
    }
}

const handleUpdate = async event => {
    event.preventDefault()
    const token = document.getElementById('token').value.trim()
    const name = document.getElementById('name').value.trim()
    const password = document.getElementById('password').value.trim()
    const body = {}
    if (name) body.name = name
    if (password) body.password = password

    try {
        const data = await requestJson(`${apiBase}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        showMessage(`Actualizado: ${data.name} (${data.email})`, 'success')
    } catch (error) {
        showMessage(error.details || error.message, 'error')
    }
}

const handleDelete = async event => {
    event.preventDefault()
    const token = document.getElementById('token').value.trim()

    try {
        const data = await requestJson(`${apiBase}/profile`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        showMessage(data.message, 'success')
    } catch (error) {
        showMessage(error.message, 'error')
    }
}

const init = () => {
    const loginForm = document.getElementById('loginForm')
    const registerForm = document.getElementById('registerForm')
    const profileForm = document.getElementById('profileForm')
    const updateForm = document.getElementById('updateForm')
    const deleteForm = document.getElementById('deleteForm')

    if (loginForm) loginForm.addEventListener('submit', handleLogin)
    if (registerForm) registerForm.addEventListener('submit', handleRegister)
    if (profileForm) profileForm.addEventListener('submit', handleGetProfile)
    if (updateForm) updateForm.addEventListener('submit', handleUpdate)
    if (deleteForm) deleteForm.addEventListener('submit', handleDelete)

    const copyButton = document.getElementById('copyTokenBtn')
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const tokenOutput = document.getElementById('tokenOutput')
            if (!tokenOutput) return
            tokenOutput.select()
            document.execCommand('copy')
            showMessage('Token copiado al portapapeles', 'success')
        })
    }
}

init()
