<template>
  <main class="home">
    <div class="login-container">
      <div class="tab-header">
        <button
          class="toggle-tab"
          :class="{'active': !showRegister}"
          @click="toggleTab"
          :disabled="!showRegister"
        >Login</button>
        <button
          class="toggle-tab"
          :class="{'active': showRegister}"
          @click="toggleTab"
          :disabled="showRegister"
        >Register</button>
      </div>
      <transition name="fade">
        <LoginForm v-if="!showRegister" />
        <Register v-if="showRegister" />
      </transition>
    </div>
  </main>
</template>

<script>
import Register from "@/components/Register.vue";
import LoginForm from "@/components/LoginForm.vue";
export default {
  name: "Login",
  components: {
    Register,
    LoginForm
  },
  data() {
    return {
      showRegister: false
    };
  },
  methods: {
    toggleTab() {
      this.showRegister = !this.showRegister;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  img {
    width: 60px;
  }
}
</style>
<style lang="scss" scoped>
main {
  margin-top: 3rem;
  min-height: 100vh;
  height: 644px;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.6s ease-in-out;
  transition: opacity 0.1s;
  //   transform-origin: center;
  //   transform: translateY(0%);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transition: 0.3s ease-in-out;
  //   transform-origin: center;
  //   transform: translateY(0%) scale(0);
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */

.login-container {
  top: 18vh;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 400px;
  margin: auto;
  min-height: 400px;
  overflow: hidden;
  background-color: whitesmoke;
  border-radius: 8px;
  border: 2px solid rgb(218, 220, 224);
  .tab-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    button {
      width: 100%;
      border: none;
      height: 2.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: 0.1s ease;
      &.active {
        border-bottom: 2px solid #1e90ff;
      }
    }
  }
}
</style>