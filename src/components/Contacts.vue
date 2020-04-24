<template>
  <div>
    <h1>Contacts</h1>

    <div class="contact-list">
      <button class="contact-item" v-for="(item,ind) in contacts" :key="ind">
        <img
          src="https://filmschoolrejects.com/wp-content/uploads/2017/04/0lZC6SveOnYzvS6Nl.jpg"
          alt="morty"
        />
        <p>{{item}}</p>
      </button>
    </div>
    <!-- Clikc Contact to Call -  -->
    <!-- Create Room - send Notification of Room Open to Contact -->
  </div>
</template>

<script>
export default {
  name: "Contacts",
  data() {
    return {
      contacts: ["Ger", "Peter"] //image //name //user ID // friends //phone number
    };
  }
};
</script>

<style lang="scss" scoped>
.contact-list {
  .contact-item {
    display: flex;
    width: 100%;
    justify-content: center;
    outline: none;
    cursor: pointer;
    border: none;
    background: transparent;
    height: 3.83rem;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin: 5px 1rem 5px 1rem;
    }
    p {
      margin-right: auto;
      padding-left: 1rem;
      border-bottom: 1px solid grey;
      width: 82%;
      text-align: left;
      margin-bottom: 0;
      height: 2.83rem;
    }
  }
}
</style>