import Vue from 'vue'
import App from './App'
import firebase from 'firebase'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDa-GpyB4jPF_IQpxlcguuX_qwKhRgA4qM",
  authDomain: "chat-app-cd3bf.firebaseapp.com",
  databaseURL: "https://chat-app-cd3bf.firebaseio.com",
  projectId: "chat-app-cd3bf",
  storageBucket: "chat-app-cd3bf.appspot.com",
  messagingSenderId: "167430057515",
  appId: "1:167430057515:web:0fae85398fc03dc6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
