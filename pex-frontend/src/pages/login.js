import axios from 'axios';

const Login = () => {

    const login = async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('pass').value;
            const response = await axios.get('http://localhost:5000/user/login/' + email + "/" + password, {Credentials: true });
            console.log(response);
            if(response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.accessToken));
                let now = new Date();
                localStorage.setItem('ttl', JSON.stringify(now.getTime() + (86400000 * 7)));
                window.location.replace('http://localhost:3000/');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="content-center">
            <h1>Log in</h1>
            <form onSubmit={login}>
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" placeholder="Email address" required />
                <label htmlFor="pass">Password</label>
                <input type="password" id="pass" name="pass" required />
                <small>Don't have an account? <a href="/register">Register</a></small>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
};

export default Login;