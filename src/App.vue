<template>
  <div id="app">
    <header class="header">
      <h1>MyChat</h1>
    </header>

    <p class="infobox">
      <transition-group name="chat" tag="div" class="list content">
        <section v-for="{ key, name, image, message } in chat" :key="key" class="item">
          <div v-if="name == user.displayName">
            <div class="item-image-my"><img :src="image" width="40" height="40"></div>
            <div class="item-detail-my">
              <div class="item-name-my">{{ name }}</div>
              <div class="item-message-my">
                <nl2br tag="div" :text="message"/>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="item-image"><img :src="image" width="40" height="40"></div>
            <div class="item-detail">
              <div class="item-name">{{ name }}</div>
              <div class="item-message">
                <nl2br tag="div" :text="message"/>
              </div>
            </div>
          </div>
        </section>
      </transition-group>
    </p>

    <!--Left section-->
<!--    <div class="item-name-left" v-if="currentUser !== null">-->
<!--      {{currentUser.displayName}}-->
<!--      <div class="item-image-right"><img :src="currentUser.photoURL" width="160" height="160"></div>-->
<!--    </div>-->

    <!--Right section-->
    <div class="item-name-right">
      {{ user .displayName }}
      <div class="item-image-right"><img :src="user.photoURL" width="160" height="160"></div>
    </div>
    <!--When user login, represent form and logout button.-->
    <div v-if="user.uid" key="login" class="item-button-right">
      <a class="button is-link is-medium" @click="doLogout">Logout</a>
    </div>
    <!--When user isn't login, represent login button.-->
    <div v-else key="logout" class="item-button-right">
      <p id="text">Choose Login Platform</p>
      <div class="select is-medium">
        <select v-model="selectItem">
          <option value="twitter">Twitter</option>
          <option value="google">Google</option>
        </select>
      </div>
      <div v-if="selectItem === 'twitter'">
        <a class="button is-link is-medium" @click="doLogin_twitter">Login</a>
      </div>
      <div v-if="selectItem === 'google'">
        <a class="button is-link is-medium" @click="doLogin_google">Login</a>
      </div>
    </div>

    <!--input field-->
    <form action="" @submit.prevent="doSend" class="form">
      <div class="field">
        <textarea class="textarea is-large" v-model="input" :disabled="!user.uid" @keydown.enter.exact.prevent="doSend" placeholder=""></textarea>
      </div>
      <div class="button-field">
        <button type="submit" :disabled="!user.uid" class="button is-info is-medium">Send</button>
      </div>
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
        input: '',
        selectItem: null,
        currentUser: firebase.auth().currentUser
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
      doLogin_twitter(){
        const provider = new firebase.auth.TwitterAuthProvider()
        firebase.auth().signInWithPopup(provider)
      },
      doLogin_google () {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
      },
      // Logout process
      doLogout () {
        firebase.auth().signOut()
      },
      scrollBottom(){
        this.$nextTick(() =>{
          //window.scrollTo(0, document.body.clientHeight)
          window.scrollTo(0, document.getElementsByClassName('list content').scrollHeight)

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
  margin-top: 30px;
  height: 930px;
  overflow: hidden;
}

h1 {
  font-size: 40px;
  font-family: 'Paytone One', sans-serif;
}
p {
  font-size: 25px;
  font-family: 'Paytone One', sans-serif;
}

#text{
  position: relative; top: -40px;;
}

* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: #87cefa;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
}
/*message box*/
.content {
  margin-left: auto;
  margin-right: auto;
  padding: 0 10px;
  max-width: 1000px;
  height: 700px;
  overflow: scroll;  /* スクロールバーを表示(※) */
  overflow-x: hidden;
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
  position: relative; top: -80px;
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
  overflow: scroll;  /* スクロールバーを表示(※) */
  overflow-x: hidden;
}

.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 1.8em;
}

/*other user list*/
.item-image{
  position: absolute; left: 10px; top: 50px;
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
  position: absolute; left: 10%;
}
.item-message {
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
  font-family: 'Paytone One', sans-serif;
  position: relative; top: 30px;left: 40px;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -20px;
  bottom: 12px;
  border: 8px solid transparent;
  border-right: 12px solid #deefe8;
}

/*my user*/
.item-image-my{
  position: absolute; left: 95%; top: 50px;
}
.item-image-my img {
  border-radius: 20px;
  vertical-align: top;
}
.item-name-my {
  font-size: 75%;
  font-family: 'Carter One', cursive;
  /*position: relative; left: 600px; top: 0px;*/
  position: absolute; left: 83%;
}
.item-message-my {
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
  font-family: 'Paytone One', sans-serif;
  position: relative; left: 520px; top: 30px;
}
.item-message-my::before {
  content: ' ';
  height: 0;
  position: absolute;
  width: 0;
  border: 10px solid transparent;
  border-left-color: #deefe8;
  left: 100%;
  bottom: 12px;
}


/*left section*/
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
  position: relative; top: -350px;
}
.item-name-left {
  position: relative; top: -600px; left:-750px;
  font-size: 40px;
}

/*right seciton*/
.item-name-right {
  position: relative; top: -650px; left:700px;
  font-size: 40px;
}
.item-button-right {
  position: relative; top: -450px; left:700px;
}
.item-image-right img {
  border-radius: 140px;
  vertical-align: top;
  position: relative; top: 40px;
}

.field{
  width: 1000px;
  height: 400px;
}
.button-field{
  height: 330px;
  width: 100px;
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

.select{
  position: relative; top: -20px;
}

.infobox {
  height: 700px;     /* 高さを制限(※) */
}

</style>
