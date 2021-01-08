import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';

const loginBtn = document.querySelector('#login');
const signupBtn = document.querySelector('#signup');
const logoutBtn = document.querySelector('.logout');

if (signupBtn) {
  signupBtn.addEventListener('submit', e => {
    console.log('Signing up');
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    console.log(name, email, password, confirmPassword);
    signup(name, email, password, confirmPassword);
  });
}

if (loginBtn) {
  loginBtn.addEventListener('submit', e => {
    console.log('The film is blue');
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
