<template>
  <div id="app">
    <div
      class="overlay"
      @click="handleOverlayClick"
      :class="{'active':isOverlayActive, 'soft':isOverlaySoft}"
    ></div>
    <Navbar />
    <transition name="bounce">
      <router-view></router-view>
    </transition>
    <Footer />
    <!-- <router-view /> -->
    <SideNav />
  </div>
</template>

<script>
import Navbar from "@/components/shared/Navbar.vue";
import SideNav from "@/components/shared/SideNav.vue";
import Footer from "@/components/Footer.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    Navbar,
    SideNav,
    Footer
  },
  computed: {
    ...mapState({
      isOverlayActive: state => state.components.isOverlayActive,
      isOverlaySoft: state => state.components.isOverlaySoft
    })
  },
  methods: {
    ...mapMutations(["components/overlayClicked"]),
    handleOverlayClick() {
      console.log("components/overlayClicked");
      this["components/overlayClicked"]();
    }
  }
};
</script>
<style >
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  position: relative;
  min-height: 100vh;
}
</style>
<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.overlay {
  position: fixed;
  z-index: 10;
  top: 3rem;
  width: 100vw;
  height: calc(100vh - 3rem);
  visibility: hidden;
  transform: scale(0);
  transform-origin: bottom left;
  opacity: 0;
  transition: 0.3s ease-in-out;
  background-color: #2d2b2ba1;
  &.active {
    opacity: 1;
    transform: scale(1);
    visibility: visible;
    &.soft {
      background-color: #2d2b2b61;
    }
  }
}
</style>