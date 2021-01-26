import axios from 'axios';
import { showAlert, hideAlert } from './alert';

export const login = async(email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        console.log(res);
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                hideAlert();
                location.replace(document.referrer);
            }, 1500);
        }
    } catch (err) {
        console.log(err.response.data.message);
        showAlert('error', err.response.data.message);
        console.log(err);
    }
};

export const logout = async() => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        console.log(res);

        if (res.data.status === 'success') {
            showAlert('success', 'Logged out successfully!');
            location.assign('/');
        }
    } catch (error) {
        console.log(error.response);
        showAlert('error', 'An error occured. Try again');
    }
};