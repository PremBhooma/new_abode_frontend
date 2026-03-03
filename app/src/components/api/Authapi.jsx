import axios from 'axios';
import config from '../../config.jsx';

export default axios.create({
    baseURL: `${config.api_url}/auth/`,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
