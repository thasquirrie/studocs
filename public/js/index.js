import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { addRequest } from './addRequest';

const loginBtn = document.querySelector('#login');
const signupBtn = document.querySelector('#signup');
const logoutBtn = document.querySelector('.logout');
const updateBtn = document.querySelector('.settings');
const updatePasswordBtn = document.querySelector('.form-user-settings');
const requestBtn = document.querySelector('#request');

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

if (requestBtn) {
    requestBtn.addEventListener('submit', e => {
        e.preventDefault();
        const title = document.querySelector('#title').value;
        const request = document.querySelector('#requests').value;
        console.log({ title, request });
        addRequest(title, request);
    })
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

if (updateBtn) {
    updateBtn.addEventListener('submit', e => {
        e.preventDefault();
        console.log('Yes we did it !');
        const form = new FormData();
        form.append('name', document.querySelector('#name').value);
        form.append('email', document.querySelector('#email').value);
        if (document.querySelector('#department')) {
            form.append('department', document.querySelector('#department').value);
        }
        form.append('photo', document.querySelector('#photo').files[0]);
        console.log(form);
        updateSettings(form, 'data');
        // const name = document.querySelector('#name').value;
        // const email = document.querySelector('#email').value;
        // const department = document.querySelector('#department').value;
        // console.log(name, email, department);
        // updateSettings({ name, email, department }, 'data');
    });
}

if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.save--password').textContent =
            'Updating passwords ...';
        const currentPassword = document.querySelector('#password-current').value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#password-confirm').value;

        await updateSettings({ currentPassword, password, confirmPassword },
            'password'
        );

        document.querySelector('#password-current').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#password-confirm').value = '';

        document.querySelector('.save--password').textContent = 'Save password';
    });
}