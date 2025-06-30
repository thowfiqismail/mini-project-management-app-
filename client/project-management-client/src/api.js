// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7110/api', // ✅ Your .NET Swagger URL
});

export default API;
