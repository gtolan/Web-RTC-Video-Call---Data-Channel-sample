<template>
  <div class="tab">
    <h1>Login</h1>
    <form @submit.prevent="handleLoginForm">
      <label for="email">Email</label>
      <input v-model="email" type="email" autocomplete="email" />
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" />
      <button type="submit">Login</button>
      <p>{{errorMsg}}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      errorMsg: ""
    };
  },
  methods: {
    ...mapActions([
      "authentication/signInWithEmailAndPassword",
      "authentication/login"
    ]),
    handleLoginForm() {
      console.log(this.email, this.password);
      let pay = {
        email: this.email,
        password: this.password
      };
      this["authentication/signInWithEmailAndPassword"](pay)
        .then(() => {
          console.log("after sign in");
          this.errorMsg = "Success!";
          this["authentication/login"]().then(() => {
            console.log("after login");
            this.$router.push("/video-call");
          });
        })
        .catch(err => {
          console.log(err, err.message);
          this.errorMsg = err.message;
        });
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
.tab {
  background-color: whitesmoke;
}
h1 {
  position: absolute;
  text-align: center;
  width: 100%;
}
form {
  top: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 1rem;
  border-radius: 8px;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  transition: 0.3s ease-in-out;
  position: absolute;
  width: calc(100% - 2rem);
  //   &:hover {
  //     // box-shadow: 0px 0px 2px 2px #d3d3d39e;
  //   }
  input,
  label,
  button {
    width: 100%;
    outline: none;
  }
  button {
    width: calc(100% + 0.45rem);
    height: 3rem;
    min-width: 200px;
    border-radius: 4px;
    text-transform: uppercase;
    cursor: pointer;
    outline: none;
    background-color: dodgerblue;
    color: white;
    font-size: 1rem;
    letter-spacing: 1px;
    font-weight: 600;
    box-shadow: 0px 0px 8px 3px #8080804a;
    transition: 0.3s ease-in-out;
    margin-top: 1rem;
    &:hover {
      background-color: #175796;
    }
  }
  label {
    text-align: left;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  input {
    padding-left: 0.5rem;
    height: 2.25rem;
    padding-left: 0.25rem;
    height: 2.25rem;
    border-radius: 3px;
    border: 1px solid lightgrey;
    font-size: 0.8rem;
  }
}
</style>