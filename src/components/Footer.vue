<template>
  <footer>
    <div class="footer-top">
      <p>*This sample is a few hours spent with WebRTC and Vuejs - I really enjoyed exploring the possible use cases and advantages OF WebRTC Peer Connection</p>
    </div>
    <div class="footer-mid">
      <a href="https://github.com/gtolan" target="_blank" rel="noreferrer">
        <img
          alt="image "
          class="github footer-icon loaded"
          data-src="images/github-footer-icon.png"
          src="https://gerardtolan.com/images/github-footer-icon.png"
        />
      </a>
      <a href="https://www.linkedin.com/in/gerardtolan/" target="_blank" rel="noreferrer">
        <img
          alt="image "
          class="linkedin footer-icon loaded"
          data-src="images/linkedin-icon.png"
          src="https://gerardtolan.com/images/linkedin-icon.png"
        />
      </a>

      <a
        href="https://bloggeek.me/massive-applications-using-webrtc/"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="image "
          class="linkedin footer-icon loaded"
          data-src="images/linkedin-icon.png"
          :src="require('../assets/blogGeek.png')"
        />
      </a>
    </div>
    <div class="footer-btm">
      <p>© {{year}} Web RTC Vue</p>
      <a href="https://gerardtolan.com/" title="gerardtolan.com">
        <img :src="gtolan" />
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      gtolan: require("../assets/gtolanlogo.png")
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style lang="scss" scoped>
footer {
  min-height: 100px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding-top: 2rem;
  background: whitesmoke;
  .footer-top {
    background-color: #b9b5b5;
    margin: 0;
    height: 100%;
    min-height: 3rem;
    p {
      max-width: 600px;
      margin: 1rem auto;
      width: 80%;
    }
  }
  .footer-mid {
    height: 7rem;
    background-color: gainsboro;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    a {
      display: inline-block;
      margin: auto 10px;

      img {
        width: 50px;
      }
    }
  }
  .footer-btm {
    min-height: 2.5rem;
    position: relative;
    background-color: #968f8f78;
    a {
      position: absolute;
      top: calc(27px - 20px);
      right: 1rem;
      img {
        height: 40px;
        width: 40px;
      }
    }
  }
}
</style>