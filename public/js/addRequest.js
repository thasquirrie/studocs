import axios from 'axios';
import { showAlert, hideAlert } from './alert';

export const addRequest = async(title, request) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/requests',
            data: {
                title,
                request,
            },
        });

        // console.log(res);
        if (res.data.status === 'success') {
            showAlert('success', 'Add request successfully');
            window.setTimeout(() => {
                hideAlert();
                location.replace(document.referrer);
            }, 1500);
        }
    } catch (err) {
        // console.log(err.response.data.message);
        showAlert('error', err.response.data.message);
        // console.log(err);
    }
};