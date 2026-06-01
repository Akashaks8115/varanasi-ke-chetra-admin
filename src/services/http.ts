import axios from 'axios';


const http = axios.create({
    // baseURL: 'http://10.235.59.213:9876/api/',
    baseURL: 'https://varanasi.ethersoftex.com/api/',

    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default http;
