import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.1.55.231:7777',
//   withCredentials: true,  // Important for sending cookies
//   credentials: 'include'
});

const url = 'http://10.1.55.231:7777';

export { api, url };