import '../auth.css'
import LoginForm from '../components/LoginForm'

const Login = () => {
    return (
        <div className="auth-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="icon">
                        <img src="https://res.cloudinary.com/dahgyycv1/image/upload/v1770533914/unnamed_ti2vel.webp" alt="VKC Logo" />
                    </div>
                    <h2>Varanasi Ke Chetra</h2>
                    <p>Admin Portal</p>
                </div>

                <div className="login-body">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login
