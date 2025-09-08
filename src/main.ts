import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import './assets/styles.css';
import './services/api'; // Import API configuration

const app = createApp(App);
app.use(router);
app.mount('#app');