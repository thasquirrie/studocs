import axios from 'axios';
import { hideAlert, showAlert } from './alert';

// export const updateUser = async (name, email, department) => {
export const updateSettings = async(data, type) => {
    try {
        const url =
            type === 'password' ?
            '/api/v1/users/updatePassword' :
            '/api/v1/users/updateMe';
        console.log(url);
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        // console.log({ status, updatedUser });
        console.log(res.data);
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
            window.setTimeout(() => {
                hideAlert();
                // location.replace(document.referrer);
            }, 1500);
        }
    } catch (err) {
        console.log(err.response.data.message);
        showAlert('error', err.response.data.message);
        console.log(err);
    }
};