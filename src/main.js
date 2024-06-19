import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from 'axios'

loadFonts()

const app = createApp(App)

// Setting up Axios globally
app.config.globalProperties.$http = axios

app
  .use(router)
  .use(vuetify)
  .mount('#app')



//   import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import { createVuetify } from 'vuetify';
// import 'vuetify/dist/vuetify.min.css';
// import { loadFonts } from './plugins/webfontloader';

// loadFonts();

// const app = createApp(App);

// app.use(router);

// const vuetify = createVuetify();
// app.use(vuetify);

// app.mount('#app');
