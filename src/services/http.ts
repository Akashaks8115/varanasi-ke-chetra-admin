import axios from 'axios';

const http = axios.create({
    // baseURL: 'http://192.168.1.21:9876/api',
    baseURL: 'https://varanasikechetraapi-production.up.railway.app/api',

    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default http;
