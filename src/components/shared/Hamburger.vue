<template>
  <!-- <button
    class="hamburger hamburger--collapse"
    :class="{'is-active': isActive}"
    type="button"
    aria-label="Menu"
    aria-controls="sideNavigation"
    @click="toggleHamburger"
  >
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  </button>-->
  <!-- https://codemyui.com/svg-css3-hamburger-to-close-button-animation/ -->
  <div
    @click="toggleHamburger"
    id="hamburger"
    class="hamburglar is-open"
    :class="{'is-closed': isActive}"
  >
    <div class="burger-icon">
      <div class="burger-container">
        <span class="burger-bun-top"></span>
        <span class="burger-filling"></span>
        <span class="burger-bun-bot"></span>
      </div>
    </div>

    <!-- svg ring containter -->
    <!-- <div class="burger-ring">
      <svg class="svg-ring">
        <path
          class="path"
          fill="none"
          stroke="#fff"
          stroke-miterlimit="10"
          stroke-width="4"
          d="M 34 2 C 16.3 2 2 16.3 2 34 s 14.3 32 32 32 s 32 -14.3 32 -32 S 51.7 2 34 2"
        />
    </svg>-->
    <!-- </div> -->
    <!-- the masked path that animates the fill to the ring -->

    <!-- <svg width="0" height="0">
      <mask id="mask">
        <path
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#ff0000"
          stroke-miterlimit="10"
          stroke-width="4"
          d="M 34 2 c 11.6 0 21.8 6.2 27.4 15.5 c 2.9 4.8 5 16.5 -9.4 16.5 h -4"
        />
      </mask>
    </svg>-->
    <!-- <div class="path-burger">
      <div class="animate-path">
        <div class="path-rotation"></div>
      </div>
    </div>-->
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Hamburger",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isOverlayActive: state => state.components.isOverlayActive,
      isOverlaySoft: state => state.components.isOverlaySoft,
      isActive: state => state.components.sideNavOpen,
      blogMenuOpen: state => state.components.blogMenuOpen,
      profileMenuOpen: state => state.components.profileMenuOpen
      //   b: state => state.b
    })
  },
  methods: {
    ...mapMutations([
      "components/toggleSideNavOpen",
      "components/toggleOverlayOpen",
      "components/removeSoftOverlay",
      "components/addSoftOverlay" // map `this.fetchCurrentTrains()` to `this.$store.dispatch('fetchCurrentTrains')`
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
        console.log(this.blogMenuOpen, this.profileMenuOpen);
        if (this.blogMenuOpen || this.profileMenuOpen) {
          //   this["components/toggleOverlayOpen"]();
          this["components/addSoftOverlay"]();
        } else {
          console.log("remove sof");
          this["components/toggleOverlayOpen"]();
          this["components/removeSoftOverlay"]();
        }
        console.log("handle close over");
      }
    },
    toggleHamburger() {
      //   this.isActive = !this.isActive;

      console.log("af", this.isOverlayActive);
      this.isOverlayActive
        ? this.handleOverlayClose()
        : this.handleOverlayOpen();
      this["components/toggleSideNavOpen"]();
    }
  },
  mounted() {
    var trigger = document.getElementById("hamburger"),
      isClosed = true;

    trigger.click(function() {
      burgerTime();
    });

    function burgerTime() {
      if (isClosed == true) {
        trigger.removeClass("is-open");
        trigger.addClass("is-closed");
        isClosed = false;
      } else {
        trigger.removeClass("is-closed");
        trigger.addClass("is-open");
        isClosed = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.left-hamburger-container {
  width: 5rem;
  height: 100%;
}
button.hamburger {
  padding: 0;
  outline: none;
  display: flex;
  width: 3rem;
  min-width: 3rem;
  height: 100%;
  text-align: center;
  padding-left: calc(1.5rem - 15px);
  padding-bottom: 4px;

  &:hover {
    background-color: gainsboro;
  }
  .hamburger-box {
    // transform: scale(0.7);
    // transform-origin: center;
    // transition: 0.3s ease-in-out;
    // vertical-align: middle;
    // height: auto;
    // height: 100%;
    // width: 100%;
    // padding-top: 1.4rem;
    // padding-left: 0.226rem;
  }
}

.hamburglar {
  transform: scale(1);
  margin: 0;
  position: relative;
  display: block;
  width: 68px;
  height: 3rem;
  background: #158fef;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: whitesmoke;
  cursor: pointer;
  &:hover {
    background: gainsboro;
  }
}

// transition mask
.path-burger {
  position: absolute;
  top: 0;
  left: 0;
  height: 68px;
  width: 68px;
  // two masks because... browser support.
  mask: url(#mask);
  -webkit-mask-box-image: url(https://raygun.io/upload/mask.svg);
}

.animate-path {
  position: absolute;
  top: 0;
  left: 0;
  width: 68px;
  height: 68px;
}

// what this does is create a small square that I then rotate behind an svg mask, giving the apparence of the line animating
.path-rotation {
  height: 34px;
  width: 34px;
  margin: 34px 34px 0 0;
  transform: rotate(0deg);
  transform-origin: 100% 0;
  &:before {
    content: "";
    display: block;
    width: 30px;
    height: 34px;
    margin: 0 4px 0 0;
    background: #fff;
  }
}

// box rotation animation
@keyframes rotate-out {
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-in {
  0% {
    transform: rotate(360deg);
  }
  40% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// offset moves
// dasharray is the dash size
// need to be able to control dash space size.

.hamburglar.is-open {
  .path {
    animation: dash-in 0.6s linear normal;
    animation-fill-mode: forwards;
  }
  .animate-path {
    animation: rotate-in 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}

.hamburglar.is-closed {
  .path {
    animation: dash-out 0.6s linear normal;
    animation-fill-mode: forwards;
  }
  .animate-path {
    animation: rotate-out 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}

.path {
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  stroke-linejoin: round;
}

@keyframes dash-in {
  0% {
    stroke-dashoffset: 240;
  }
  40% {
    stroke-dashoffset: 240;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash-out {
  0% {
    stroke-dashoffset: 0;
  }
  40% {
    stroke-dashoffset: 240;
  }
  100% {
    stroke-dashoffset: 240;
  }
}

// All good burgers need filling!

.burger-icon {
  position: absolute;
  padding: 0;
  height: 3rem;
  min-width: 1rem;
  margin: 0;
  margin-left: calc(1.5rem - 15px);
}

.burger-container {
  position: relative;
  height: 28px;
  width: 36px;
  margin: auto;
  transform: scale(0.75);
  transform-origin: center;
  margin-top: calc(1.5rem - 14px);
}

.burger-bun-top,
.burger-bun-bot,
.burger-filling {
  position: absolute;
  display: block;
  height: 4px;
  width: 36px;
  border-radius: 2px;
  background: black;
}

.burger-bun-top {
  top: 0;
  transform-origin: 34px 2px;
}

.burger-bun-bot {
  bottom: 0;
  transform-origin: 34px 2px;
}
//.burger-filling {
//  @include transition(all,(.6s/2.5),ease-in-//out);
//}
// relative parent is the button
.burger-filling {
  top: 12px;
}

// burger ring container
.burger-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 68px;
  height: 68px;
}

.svg-ring {
  width: 68px;
  height: 68px;
}

// bun animations
.hamburglar.is-open {
  .burger-bun-top {
    animation: bun-top-out 0.6s linear normal;
    animation-fill-mode: forwards;
  }
  .burger-bun-bot {
    animation: bun-bot-out 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}
.hamburglar.is-closed {
  .burger-bun-top {
    animation: bun-top-in 0.6s linear normal;
    animation-fill-mode: forwards;
  }
  .burger-bun-bot {
    animation: bun-bot-in 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}

@keyframes bun-top-out {
  0% {
    left: 0;
    top: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    top: 0;
    transform: rotate(15deg);
  }
  80% {
    left: -5px;
    top: 0;
    transform: rotate(-60deg);
  }
  100% {
    left: -5px;
    top: 1px;
    transform: rotate(-45deg);
  }
}

@keyframes bun-bot-out {
  0% {
    left: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    transform: rotate(-15deg);
  }
  80% {
    left: -5px;
    transform: rotate(60deg);
  }
  100% {
    left: -5px;
    transform: rotate(45deg);
  }
}

@keyframes bun-top-in {
  0% {
    left: -5px;
    bot: 0;
    transform: rotate(-45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(-60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(15deg);
  }
  100% {
    left: 0;
    bot: 1px;
    transform: rotate(0deg);
  }
}

@keyframes bun-bot-in {
  0% {
    left: -5px;
    transform: rotate(45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(-15deg);
  }
  100% {
    left: 0;
    transform: rotate(0deg);
  }
}

// burger filling
.hamburglar.is-open {
  .burger-filling {
    animation: burger-fill-out 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}

.hamburglar.is-closed {
  .burger-filling {
    animation: burger-fill-in 0.6s linear normal;
    animation-fill-mode: forwards;
  }
}

@keyframes burger-fill-in {
  0% {
    width: 0;
    left: 36px;
  }
  40% {
    width: 0;
    left: 40px;
  }
  80% {
    width: 36px;
    left: -6px;
  }
  100% {
    width: 36px;
    left: 0px;
  }
}

@keyframes burger-fill-out {
  0% {
    width: 36px;
    left: 0px;
  }
  20% {
    width: 42px;
    left: -6px;
  }

  40% {
    width: 0;
    left: 40px;
  }

  100% {
    width: 0;
    left: 36px;
  }
}
@media only screen and (min-width: 700px) {
  .burger-container {
    transform: scale(1);
    transform-origin: center;
    margin-left: 1rem;
  }

  .hamburglar {
    transform: scale(1);
    margin: 0;
    position: relative;
    display: block;
    width: 5rem;
    height: 4rem;

    .burger-icon {
      position: absolute;
      padding: 0;
      height: 5rem;
      min-width: 1rem;
      margin: 0;
      margin-left: calc(1.5rem - 15px);
      .burger-container {
        transform: scale(1);
        transform-origin: center;
        margin-left: 0.5rem;
        margin-top: 18px;
      }
    }
  }
}
</style>