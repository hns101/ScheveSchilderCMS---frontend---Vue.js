import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import './assets/styles.css';

// The createApp function is typed to expect a Vue component instance
const app = createApp(App);

// Use the router
app.use(router);

// Mount the app to the DOM
app.mount('#app');
