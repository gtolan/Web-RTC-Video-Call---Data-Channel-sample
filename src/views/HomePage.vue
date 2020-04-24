<template>
  <!-- <transition name="bounce"> -->
  <div class="homepage">
    <div class="jumbotron">
      <!-- //:src="webRTCImage" -->
      <img src="https://www.wowza.com/uploads/images/WebRTC.gif" />
    </div>
    <div class="content">
      <h1>Real Time Peer to Peer</h1>
      <h3>Video Calls</h3>
      <h3>Two way instant data channels</h3>
      <h3>Authentication and Contacts</h3>
      <h5>Vuejs + Firebase</h5>
      <a href="#whereRTC">
        <button>Show me More</button>
      </a>
    </div>
    <HomeContent />
  </div>
  <!-- </transition> -->
</template>

<script>
import HomeContent from "@/components/HomeContent.vue";
export default {
  name: "HomePage",
  components: {
    HomeContent
  },
  data() {
    return {
      show: true,
      webRTCImage: require("../assets/webrtc.jpg")
    };
  }
};
</script>

<style lang="scss" scoped>
div.homepage {
  margin-top: 2rem;
  div.content {
    position: absolute;

    top: 3rem;
    text-align: left;

    padding-left: 1rem;
    h3 {
      margin: 15px auto;
    }
    button {
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
      &:hover {
        background-color: #175796;
      }
    }
  }
  div.jumbotron {
    width: 100vw;
    min-height: 580px;
    max-height: 400px;
    object-fit: cover;
    display: flex;
    justify-content: center;
    align-content: center;
    img {
      width: 100%;
      max-width: 200px;
      margin-top: auto;
      margin-left: auto;
      margin-right: 2rem;
    }
  }
}

@media only screen and (min-width: 450px) {
  div.homepage {
    div.content {
      top: 4rem;
      h3 {
        margin: 1rem auto;
      }
    }
    div.jumbotron {
      min-height: 425px;

      img {
      }
    }
  }
}
@media only screen and (min-width: 600px) {
  div.homepage {
    div.content {
      top: 3rem;
      padding-left: 2rem;
      h1 {
        font-size: 3rem;
      }
      h3 {
        font-size: 1.5rem;
      }
    }
    div.jumbotron {
      min-height: 389px;

      img {
        margin-right: 3rem;
      }
    }
  }
}
@media only screen and (min-width: 850px) {
  div.homepage {
    div.content {
      padding-left: 4rem;
      h1 {
      }
      h3 {
      }
    }
    div.jumbotron {
      img {
        max-width: 259px;
        margin-right: 9rem;
      }
    }
  }
}
</style>