import axios from 'axios';
import { hideAlert, showAlert } from './alert';

export const signup = async(name, email, password, confirmPassword) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                confirmPassword,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Signed up successfully');
            window.setTimeout(() => {
                hideAlert();
                location.replace(document.referrer);
            }, 1500);
        }
    } catch (error) {
        console.log('Error:', error.response.data.message);
    }
};