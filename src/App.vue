<template>
  <div id="app">
    <header class="header">
      <h1>Chat</h1>
<!--      &lt;!&ndash;When user login, represent form and logout button.&ndash;&gt;-->
<!--      <div v-if="user.uid" key="login">-->
<!--&lt;!&ndash;        [{{ user .displayName}}]&ndash;&gt;-->
<!--        <button type="button" @click="doLogout">Logout</button>-->
<!--      </div>-->
<!--      &lt;!&ndash;When user isn't login, represent login button.&ndash;&gt;-->
<!--      <div v-else key="logout">-->
<!--        <button type="button" @click="doLogin">Login</button>-->
<!--      </div>-->
    </header>

    <p class="infobox">
      <transition-group name="chat" tag="div" class="list content">
        <section v-for="{ key, name, image, message } in chat" :key="key" class="item">
          <div class="item-image"><img :src="image" width="40" height="40"></div>
          <div class="item-detail">
            <div class="item-name">{{ name }}</div>
            <div class="item-message">
              <nl2br tag="div" :text="message"/>
            </div>
          </div>
        </section>
      </transition-group>
    </p>

    <!--Left section-->
<!--    <section v-for="{ key, name, image, message } in chat" :key="key" class="item-left">-->
<!--      <div class="item-image-left"><img :src="image" width="60" height="60"></div>-->
<!--      <div class="item-name-left">{{ name }}</div>-->
<!--    </section>-->

    <!--Right section-->
    <div class="item-name-right">
      {{ user .displayName }}
      <div class="item-image-right"><img :src="user.photoURL" width="160" height="160"></div>
    </div>
    <!--When user login, represent form and logout button.-->
    <div v-if="user.uid" key="login" class="item-button-right">
      <a class="button is-primary" @click="doLogout">Logout</a>
    </div>
    <!--When user isn't login, represent login button.-->
    <div v-else key="logout" class="item-button-right">
      <a class="button is-success" @click="doLogin">Login</a>
    </div>

    <!--input field-->
    <form action="" @submit.prevent="doSend" class="form">
      <textarea v-model="input" :disabled="!user.uid" @keydown.enter.exact.prevent="doSend"></textarea>
      <button type="submit" :disabled="!user.uid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
  // firebase module
  import firebase from 'firebase'
  import Nl2br from 'vue-nl2br'
  export default {
    components: {Nl2br},
    data(){
      return{
        user: {},
        chat: [],
        input: ''
      }
    },
    created() {
      firebase.auth().onAuthStateChanged(user => {
        this.user = user ? user : {}
        const ref_message = firebase.database().ref('message')
        if(user){
          this.chat = []
          // Register handler when message is changed
          ref_message.limitToLast(10).on('child_added', this.childAdded)
        }else{
          // Release the handler when there is a change in message
          ref_message.limitToLast(10).off('child_added', this.childAdded)
        }
      })
    },
    methods: {
      // Login process
      doLogin(){
        const provider = new firebase.auth.TwitterAuthProvider()
        firebase.auth().signInWithPopup(provider)
      },
      // Logout process
      doLogout(){
        firebase.auth().signOut()
      },
      // doLogin () {
      //   const provider = new firebase.auth.GoogleAuthProvider()
      //   firebase.auth().signInWithPopup(provider)
      // },
      // doLogout () {
      //   firebase.auth().signOut()
      // },
      scrollBottom(){
        this.$nextTick(() =>{
          window.scrollTo(0, document.body.clientHeight)
        })
      },
      childAdded(snap){
        const message = snap.val()
        this.chat.push({
          key: snap.key,
          name: message.name,
          image: message.image,
          message: message.message
        })
        this.scrollBottom()
      },
      doSend(){
        if(this.user.uid && this.input.length){
          // Add a message to firebase
          firebase.database().ref('message').push({
            message: this.input,
            name: this.user.displayName,
            image: this.user.photoURL
          }, () =>{
            // Clear form
            this.input =''
          })
        }
      }
    }
  }
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 40px;
}

* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: #3ab383;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 4em;
  width: calc(100% - 6em);
  resize: none;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-image img {
  border-radius: 20px;
  vertical-align: top;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-name {
  font-size: 75%;
  font-family: 'Carter One', cursive;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
  font-family: 'Paytone One', sans-serif;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #deefe8;
}


.item-left {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
  margin-left: 400px;
}
.item-image-left img {
  border-radius: 40px;
  vertical-align: top;
  margin-bottom: 0.5em;
  margin-left: 150px;
  position: relative; top: -350px; left:0px;
}
.item-name-left {
  position: relative; top: -375px; left:20px;
}


.item-name-right {
  position: relative; top: -750px; left:700px;
  font-size: 40px;
}
.item-button-right {
  position: relative; top: -550px; left:700px;
}
.item-image-right img {
  border-radius: 140px;
  vertical-align: top;
  position: relative; top: 40px; right:0px;
}


.send-button {
  height: 4em;
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}

.infobox {
  height: 800px;     /* 高さを制限(※) */
  overflow: scroll;  /* スクロールバーを表示(※) */
}

</style>
