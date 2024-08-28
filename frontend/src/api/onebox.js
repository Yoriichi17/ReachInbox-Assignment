import axios from 'axios';
import { authHeader } from './auth'; 

const API_BASE_URL = 'https://hiring.reachinbox.xyz/api/v1/onebox';

export const fetchEmails = () => {
    return axios.get(`${API_BASE_URL}/list`, { headers: authHeader() });
};

export const deleteEmail = (threadId) => {
    return axios.delete(`${API_BASE_URL}/messages/${threadId}`, { headers: authHeader() });
};

export const sendReply = (threadId, replyData) => {
    return axios.post(`${API_BASE_URL}/reply/${threadId}`, replyData, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
        },
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Failed to send reply: ${response.statusText}`);
        }
        return response.data;
    }).catch(error => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw error;
    });
};

export const resetEmails = () => {
    return axios.get(`${API_BASE_URL}/reset`, { headers: authHeader() })
        .then(response => {
            console.log('Reset API response:', response);
            if (response.status !== 200) {
                throw new Error(`Failed to reset emails: ${response.statusText}`);
            }
            return response.data;
        })
        .catch(error => {
            console.error('Error details:', error.response ? error.response.data : error.message);
            throw error;
        });
};

