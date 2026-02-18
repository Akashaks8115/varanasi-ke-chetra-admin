import axios from 'axios';

const http = axios.create({
    baseURL: 'http://192.168.0.198:9876',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default http;
