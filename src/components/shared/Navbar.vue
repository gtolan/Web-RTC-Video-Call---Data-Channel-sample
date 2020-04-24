<template>
  <nav id="nav">
    <Hamburger />
    <router-link to="/" title="home">
      <div class="logo">
        <h4 class="title">Web RTC</h4>
        <!-- <img :src="logoSrc" alt="advice logo" /> -->
      </div>
    </router-link>
    <button class="right-nav hangup-nav-btn" :class="{'active': this.videoCallStarted}">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M21 14.2V8.91c0-.89-1.08-1.34-1.71-.71L17 10.5V7c0-.55-.45-1-1-1h-5.61l8.91 8.91c.62.63 1.7.18 1.7-.71zM2.71 2.56c-.39.39-.39 1.02 0 1.41L4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18l2.48 2.48c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.12 2.56c-.39-.39-1.02-.39-1.41 0z"
        />
      </svg>
    </button>
    <router-link class="right-nav" to="/login" title="login">
      <span class="sm-screen">
        <svg
          class="app"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"
          />
        </svg>
      </span>
      <span class="md-screen">
        <svg
          class="app"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"
          />
        </svg>
      </span>
    </router-link>
  </nav>
</template>

<script>
import Hamburger from "@/components/shared/Hamburger.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Navbar",
  components: {
    Hamburger
  },
  data() {
    return {
      //   blogMenuOpen: false
    };
  },
  computed: {
    ...mapState({
      token: state => state.authentication.token,
      blogMenuOpen: state => state.components.blogMenuOpen,
      isOverlayActive: state => state.components.isOverlayActive,
      isOverlaySoft: state => state.components.isOverlaySoft,
      sideNavOpen: state => state.components.sideNavOpen,
      profileMenuOpen: state => state.components.profileMenuOpen,
      videoCallStarted: state => state.components.videoCallStarted

      //   b: state => state.b
    }),
    isLoggedIn() {
      return this.token ? true : false;
    }
  },
  methods: {
    ...mapMutations([
      "components/toggleBlogMenuOpen",
      "components/toggleOverlayOpen",
      "components/addSoftOverlay",
      "components/removeSoftOverlay"
    ]),
    handleOverlayOpen() {
      console.log("handle open", this.isOverlayActive);
      if (!this.isOverlayActive) {
        console.log("handle open soft over");
        this["components/toggleOverlayOpen"]();
      }
      this["components/addSoftOverlay"]();
    },
    handleOverlayClose() {
      if (this.isOverlayActive) {
        console.log("HOC BTD", this.sideNavOpen, this.profileMenuOpen);
        if (this.sideNavOpen || this.profileMenuOpen) {
          this["components/addSoftOverlay"]();
        } else {
          console.log("add sof");
          this["components/toggleOverlayOpen"]();
          //   this["components/toggleOverlayOpen"]();
          this["components/removeSoftOverlay"]();
        }
        console.log("handle close over");
      }
    },

    toggleDropdown() {
      console.log("toggle", this.blogMenuOpen, "OA", this.isOverlayActive);
      //   this.blogMenuOpen = !this.blogMenuOpen;

      this.isOverlayActive
        ? this.handleOverlayClose()
        : this.handleOverlayOpen();
      this["components/toggleBlogMenuOpen"]();
    }
  }
};
</script>

<style lang="scss" scoped>
nav#nav {
  padding: 0;
  //background-color: #075f56;
  background: whitesmoke;
  color: white;
  z-index: 11;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 3rem;
  position: fixed;
  width: 100vw;
  top: 0;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  a,
  button.dropdown, //:not(.hamburger)
  p {
    font-weight: bold;
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    flex-direction: column;
    text-decoration: none;
    transition: 0.3s ease-in-out;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    &:hover {
      background-color: gainsboro;
    }
    &.router-link-exact-active {
      // color: white;
      // background-color: #075f56;
      color: black;
      background-color: whitesmoke;
      &:hover {
        background-color: gainsboro;
      }
    }
  }
  a {
    span.sm-screen {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      height: 100%;
      align-items: center;
      svg {
        fill: white;
        fill: black;
        margin-top: -3px;
      }
    }
  }
  button div {
    span.sm-screen {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      height: 100%;
      align-items: center;
      svg {
        margin-top: 3px;
        fill: white;
        fill: black;
      }
    }
  }
}

// Extract to Dropdown Component
button.dropdown {
  .header {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    min-width: calc((100vw - 5rem) / 5);

    position: relative;
    font-size: 0.97rem;
    margin-top: -2px;

    button.collapse {
      position: absolute;
      right: 11px;
      top: 14px;
      height: 39px;
      padding: 0;
      width: 41px;
      justify-content: center;
      align-content: center;
      display: flex;
      border-radius: 50%;
      outline: none;
      cursor: pointer;
      position: absolute;
      width: 40px;
      right: 0;
      height: 100%;
      top: 0;
      background-color: transparent;
      height: 33px;
      width: 33px;
      border: none;
      margin-top: 8px;
      margin-right: 10px;

      svg {
        transform: rotate(90deg);
        transition: 0.3s ease-in-out;
        height: 35px;
        width: 35px;
        margin-top: 8px;
        margin-right: 0px;
        fill: white;
        fill: black;
      }
      &.active {
        svg {
          transform: rotate(270deg);
        }
      }
    }
  }
}
@keyframes scaleOpenMenu {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.menu {
  visibility: hidden;
  position: absolute;
  top: 3rem;
  background: #143e8c;
  width: auto;
  min-width: calc((100vw - 1rem) / 5);
  min-width: 123px;
  // min-width: calc((100vw - 1rem) / 5);
  max-width: calc((100vw - 1rem) / 3);
  width: 100%;
  text-align: left;
  padding: 1rem;
  //   animation: scaleOpenMenu 0.5s ease-in-out;
  //   animation-fill-mode: forwards;
  //   animation-direction: reverse;
  transform: scale(0);
  will-change: transform;
  transition: 1s;
  background-color: white;
  color: black;

  border: 1px solid lightgray;
  box-shadow: 0px 0px 3px 2px #8080808f;
  border-radius: 3px;
  border-top-left-radius: 0;
  margin-top: 2px;
  padding: 0;
  overflow: hidden;
  padding-bottom: 10px;
  transform-origin: left top;

  &.active {
    display: block;

    // animation: scaleOpenMenu 0.5s ease-in-out;
    // animation-fill-mode: forwards;
    visibility: visible;
    transform: scale(1);
  }
  a.menu-item {
    color: black !important;
    height: 2rem !important;
    background-color: white !important;
    padding-left: 10px !important;
    font-size: 1rem;
    border-bottom: 1px solid #80808033 !important;

    background: transparent;
    border: none;
    border-bottom: 1px solid lightgray;
    font-size: 1rem;
    text-align: center;
    cursor: pointer;
    transition: 0.3s ease-in-out;

    font-weight: 400 !important;
    padding-left: 0 !important;
    &:hover {
      background: whitesmoke !important;
    }
  }
}
.logo {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  padding-left: 1rem;
  img {
    width: 73px;
    margin-top: 0px;
    margin: auto;
  }
  h4.title {
    color: black;
  }
}

.sm-screen {
  display: block;
}

.md-screen {
  display: none;
  svg.app {
    fill: white;
    fill: black;
    height: 28px;
    width: 30px;
    margin-top: 3px;
  }
}
@import url("https://fonts.googleapis.com/css2?family=Baloo+Tamma+2:wght@500&display=swap");
@media only screen and (min-width: 700px) {
  .sm-screen {
    display: none !important;
  }

  .md-screen {
    display: block;
  }
  nav#nav {
    height: 4rem;
  }
  .logo {
    img {
      width: 97px;
    }
    h4 {
      font-family: "Baloo Tamma 2", cursive;
      color: white;
      color: black;
      font-size: 1.25rem;
    }
  }
  button.dropdown {
    .header {
      min-width: calc((100vw - 0rem) / 5);
    }
  }
  .menu {
    top: 4rem;
  }
}

.right-nav {
  width: 3rem !important;
}
.hangup-nav-btn {
  width: 3rem !important;
  padding: 0;
  height: 100%;
  border: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  &.active {
    svg {
      fill: red;
    }
  }
  svg {
    fill: white;
    fill: black;
  }
  &:hover {
    background-color: gainsboro;
  }
}
</style>