<template>
  <aside class="sidenav" :class="{'show': isOpen}" id="sideNavigation">
    <div class="link-container">
      <div
        class="router-btn"
        @click="closeSideNav"
        v-for="(item, index) in sideNavLocations"
        :key="`${item.link}-${index}`"
      >
        <router-link :to="item.link">
          <img class="icon" :src="item.icon" />
          <span>{{item.title}}</span>
        </router-link>
        <!-- 
        <div class="sub-cateogory" v-if="item.subcategory">
          <div class="sub-cat-item" v-for="(sub, ind) in item.subcategory" :key="ind">
            <img class="icon" :src="item.icon" />
            <span>{{item.title}}</span>
          </div>
        </div>-->
      </div>
    </div>
  </aside>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "SideNav",
  data() {
    return {
      sideNavLocations: [
        {
          title: "Home",
          link: "/",
          icon: ""
          // subcategory: [
          //   { title: "Why?", link: "/", icon: "" },
          //   { title: "How?", link: "/", icon: "" },
          //   { title: "What?", link: "/", icon: "" },
          //   { title: "When?", link: "/", icon: "" }
          // ]
        },
        {
          title: "Login",
          link: "/login",
          icon: ""
        },
        // {
        //   title: "Dashboard",
        //   link: "/dashboard",
        //   icon: ""
        // },
        {
          title: "Start Chat",
          link: "/video-call",
          icon: ""
        }
      ]
    };
  },
  computed: {
    ...mapState({
      isOpen: state => state.components.sideNavOpen
      //   b: state => state.b
    })
  },
  methods: {
    ...mapMutations([
      "components/toggleSideNavOpen",
      "components/toggleOverlayOpen"
    ]),
    closeSideNav() {
      console.log("closeSideNav");
      this["components/toggleSideNavOpen"]();
      this["components/toggleOverlayOpen"]();
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes fillBackground {
  0% {
    background-position: 0% 48%;
    color: black;
  }
  100% {
    background-position: 100% 53%;
    color: white;
  }
}
aside {
  position: fixed;
  top: 3rem;
  box-shadow: 0px 0px 3px 2px #8080808f;
  z-index: 10;
  height: calc(100vh - 3rem);
  overflow-y: scroll;
  width: 255px;
  background-color: white;
  text-align: left;
  padding-top: 0rem;
  transition: 0.3s ease-in-out;
  transform: translateX(-100%);
  border: none;
  //   border-radius: 8px;
  &.show {
    transform: translateX(0%);
  }
  .link-container {
    overflow-y: scroll;
    height: 100%;
    width: 100%;
  }
  .router-btn {
    height: 3.5rem;
    outline: none;
    background-color: transparent;
    display: block;
    width: 100%;
    display: flex;
    flex-direction: row;
    font-size: 20px;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
    border: none;
    width: 100%;
    color: black;
    text-decoration: none;

    &:hover {
      background: linear-gradient(82deg, white, #1e90ff);
      background-size: 200% 200%;
      color: white;
      animation: fillBackground 0.5s ease-in-out;
      animation-iteration-count: 1;

      animation-fill-mode: forwards;
      a {
        span {
          color: white;
        }
      }
    }
    a {
      width: 100%;
      height: 100%;
      display: -webkit-inline-box;
      text-decoration: none;
      color: black;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      .icon {
        width: 50px;
        margin: 8px;
        margin-right: 10px;
      }
      span {
        height: 100%;
        width: 100%;
        text-align: left;
        display: flex;
        justify-content: center;
        align-content: center;
        padding-left: 10px;
        flex-direction: column;
        vertical-align: middle;
      }
    }
  }
}
@media only screen and (min-width: 700px) {
  aside {
    top: 4.1rem;
  }
}
</style>