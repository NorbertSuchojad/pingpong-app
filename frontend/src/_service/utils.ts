export function getApiUri() {
    if (process.env.NODE_ENV !== 'production') {
        return "http://localhost:8080/api/v1"
    } else {
        return "http://localhost/api/v1"
    }
}

export function getGoogleAcc() {
    //FIXME move to env
    if (process.env.NODE_ENV !== 'production') {
        return "742670116327-4d04obactuvs7h0khd9rg18pekrs7528.apps.googleusercontent.com"
    } else {
        return "821953180817-harl52auo2r5207hm32voc2bt82772jd.apps.googleusercontent.com"
    }
}

export function validateToken() {
    const token_expiration_date = localStorage.getItem('expiration_date') as unknown as number | 0
    if (token_expiration_date === 0 || Date.now() < token_expiration_date) {
        localStorage.clear()
        window.location.replace('/login')
        return;
    }
    console.log('token still valid')
}
