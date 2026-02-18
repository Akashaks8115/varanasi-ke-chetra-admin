import { useState } from 'react'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!username || !password) {
            alert('All fields are required')
            return
        }

        console.log({ username, password })
        alert('Dummy login success')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button className="login-btn" type="submit">
                Sign In
            </button>
        </form>
    )
}

export default LoginForm
