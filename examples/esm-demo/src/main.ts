import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import monaco from './monaco.ts';
import plugin from 'monaco-components';
import registerCompletion from './registerCompletion.js';
registerCompletion(monaco, 'sql');

import './assets/main.css';

const app = createApp(App);

app.use(router);

console.log(plugin)

app.use(plugin, {
  monaco
});

app.mount('#app');
