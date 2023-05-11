import axios from 'axios';

const Register = () => {

    const register = async (e) => {
        e.preventDefault();
        if(document.getElementById('pass').value !== document.getElementById('pass2').value) {
            alert('Passwords do not match!');
            return;
        }

        let isAdmin = false;

        if(document.getElementById('switch').checked) {
            isAdmin = true;
        }

        const response = await axios.post('https://api.sigve.dev/user/register', {
            firstname: document.getElementById('fname').value,
            lastname: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('pass').value,
            isAdmin: isAdmin
        });
        console.log(response);
        if(response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data.accessToken));
            let now = new Date();
            localStorage.setItem('ttl', JSON.stringify(now.getTime() + (86400000 * 7)));
            window.location.replace('http://localhost:3000/');
        } else {
            alert('There was an error registering your account.');
        }
    };

    return (
        <div className="content-center">
            <h1>New User</h1>
            <form onSubmit={register}>
                <div className="grid">
                    <label htmlFor="fname">First name
                        <input type="text" id="fname" name="fname" placeholder="First name" required />
                    </label>
                    <label htmlFor="lname">Last name
                        <input type="text" id="lname" name="lname" placeholder="Last name" required />
                    </label>
                </div>
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" placeholder="Email address" required />
                <label htmlFor="pass">Password</label>
                <input type="password" id="pass" name="pass" required />
                <label htmlFor="pass2">Confirm password</label>
                <input type="password" id="pass2" name="pass2" required />
                <label htmlFor="switch">
                  <input type="checkbox" id="switch" name="switch" role="switch" />
                  admin
                </label>
                <small>By registering, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</small><br />
                <small>Have an account? <a href="/login">Log in</a></small>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;