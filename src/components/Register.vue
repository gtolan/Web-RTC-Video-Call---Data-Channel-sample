<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleFormSubmit">
      <label for="email">Email</label>
      <input id="email" placeholder="email" v-model="email" type="text" />
      <label for="displayName">Name</label>
      <input id="displayName" placeholder="Name" v-model="displayName" type="text" />
      <label for="password">Password</label>
      <input id="password" placeholder="Password" v-model="password" type="password" />

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      displayName: "",
      password: ""
    };
  },
  methods: {
    ...mapActions([
      "authentication/register",
      "authentication/signInWithEmailAndPassword"
    ]),
    handleFormSubmit() {
      let payload = {
        email: this.email,
        password: this.password,
        displayName: this.displayName,
        online: true,
        contacts: [null]
      };
      this["authentication/register"](payload)
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch(() => {
          console.log("error-registering");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
  //     box-shadow: 0px 0px 2px 2px #d3d3d39e;
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