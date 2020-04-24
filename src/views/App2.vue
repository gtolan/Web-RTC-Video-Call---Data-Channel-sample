<template>
  <div id="app">
    <div
      class="overlay"
      @click="handleOverlayClick"
      :class="{'active':isOverlayActive, 'soft':isOverlaySoft}"
    ></div>
    <Navbar />
    <div id="buttons">
      <button class="mdc-button mdc-button--raised" id="cameraBtn">
        <!-- <i class="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i> -->
        <span class="mdc-button__label">Open camera & microphone</span>
      </button>
      <button class="mdc-button mdc-button--raised" id="createBtn">
        <!-- <i class="material-icons mdc-button__icon" aria-hidden="true">group_add</i> -->
        <span class="mdc-button__label">Create room</span>
      </button>
      <button class="mdc-button mdc-button--raised" id="joinBtn">
        <!-- <i class="material-icons mdc-button__icon" aria-hidden="true">group</i> -->
        <span class="mdc-button__label">Join room</span>
      </button>
      <!-- <button class="mdc-button mdc-button--raised" disabled id="hangupBtn">
         <i class="material-icons mdc-button__icon" aria-hidden="true">close</i> 
        <span class="mdc-button__label">Hangup</span>
      </button>-->
    </div>

    <main>
      <div>
        <button class="open-modal" @click="openModal">Open Modal</button>
        <button class="mdc-button mdc-button--raised" @click="hangUp" id="hangupBtn">Hangup</button>
        <span id="currentRoom"></span>
      </div>
      <div id="videos" :class="{'active':!isModalOpen}">
        <div class="video-one">
          <video id="localVideo" muted autoplay playsinline></video>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
            />
          </svg>
        </div>
        <div class="video-two">
          <video id="remoteVideo" autoplay playsinline></video>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
            />
          </svg>
        </div>
      </div>
    </main>
    <!-- Modal -->
    <div class="overlay" :class="{'active':isModalOpen}">
      <div
        class="mdc-dialog"
        :class="{'active':isModalOpen}"
        id="room-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="my-dialog-title"
        aria-describedby="my-dialog-content"
      >
        <div class="tabs">
          <button :class="{'active':!this.joinOption}" @click="setTab('create')">Create a Chat</button>
          <button :class="{'active':this.joinOption}" @click="setTab('join')">Join a Chat</button>
        </div>
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface">
            <div class="join-container" v-show="joinOption">
              <h2 class="mdc-dialog__title" id="my-dialog-title">Join a live room</h2>
              <div class="mdc-dialog__content" id="my-dialog-content">
                <p>Enter the room ID to join:</p>
                <div class="mdc-text-field">
                  <input type="text" id="room-id" class="mdc-text-field__input" />
                  <label class="mdc-floating-label" for="my-text-field">Room ID</label>
                  <div class="mdc-line-ripple"></div>
                </div>
                <footer class="mdc-dialog__actions">
                  <button
                    @click="closeModal"
                    type="button"
                    class="mdc-button mdc-dialog__button cancel"
                    data-mdc-dialog-action="no"
                  >
                    <span class="mdc-button__label">Cancel</span>
                  </button>
                  <button
                    id="confirmJoinBtn"
                    ref="confirm"
                    type="button"
                    class="mdc-button mdc-dialog__button create"
                    data-mdc-dialog-action="yes"
                  >
                    <span class="mdc-button__label">Join</span>
                  </button>
                </footer>
              </div>
            </div>
            <div class="create-container" v-show="!joinOption">
              <!-- <h2 class="mdc-dialog__title" id="my-dialog-title">Create a room</h2> -->
              <h2>{{createTitle}}</h2>
              <!-- <h4>invite others to join</h4> -->
              <div
                class="mdc-dialog__content"
                :class="{'active':roomCreated}"
                id="my-dialog-content"
              >
                <div class="mdc-text-field room-created-succ" v-if="roomCreated">
                  <h4>invite others to join</h4>
                  <div class="invite-container">
                    <input
                      placeholder="invite .."
                      type="text"
                      id="room-id"
                      class="mdc-text-field__input"
                    />
                    <button class="add">+</button>
                    <label class="mdc-floating-label" for="my-text-field">Email</label>
                  </div>
                  <div class="mdc-line-ripple"></div>
                </div>

                <button
                  @click="closeModal"
                  :class="{'active':roomCreated}"
                  type="button"
                  class="mdc-button mdc-dialog__button cancel"
                  data-mdc-dialog-action="no"
                >
                  <span class="mdc-button__label">Cancel</span>
                </button>
                <!-- button below // -->
                <button
                  v-if="!roomCreated"
                  class="create"
                  @click="handleCreateChatRoom"
                >Create a Room</button>
              </div>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    </div>
    <!-- Modal End -->

    <!-- <router-view /> -->
    <SideNav />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import firebase from "firebase";
import Navbar from "@/components/shared/Navbar.vue";
import SideNav from "@/components/shared/SideNav.vue";
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
    }
  ],
  iceCandidatePoolSize: 10
};
export default {
  name: "App",
  components: {
    Navbar,
    SideNav
  },
  data() {
    return {
      isModalOpen: true,
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      roomDialog: null,
      roomId: null,
      joinOption: false,
      roomCreated: false,
      createTitle: "Create a chat room"
    };
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
    },
    setTab(tab) {
      tab == "join" ? (this.joinOption = true) : (this.joinOption = false);
      // tab == "join" ? this.joinRoom() : null;
    },
    hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },
    closeModal() {
      this.isModalOpen = false;
    },
    openModal() {
      this.isModalOpen = true;
    },
    handleCreateChatRoom() {
      // this.openUserMedia();
      this.createRoom();
      this.roomCreated = !this.roomCreated;
    },
    registerPeerConnectionListeners() {
      this.peerConnection.addEventListener("icegatheringstatechange", () => {
        console.log(
          `ICE gathering state changed: ${this.peerConnection.iceGatheringState}`
        );
      });

      this.peerConnection.addEventListener("connectionstatechange", () => {
        if (
          this.peerConnection.connectionState === "failed" ||
          this.peerConnection.connectionState === "disconnected"
        ) {
          this.peerConnection.restartIce();
          // this.peerConnection.createOffer({ iceRestart: true }).then(offer => {
          //   this.peerConnection.setLocalDescription(offer);
          //   console.log(offer, "offer");
          //   const roomWithOffer = {
          //     offer: {
          //       type: offer.type,
          //       sdp: offer.sdp
          //     }
          //   };
          //   const roomRef = firebase
          //     .firestore()
          //     .collection("rooms")
          //     .doc(`${this.roomId}`);
          //   roomRef.set(roomWithOffer).then(() => {
          //     console.log("reset roomwrrite");
          //   });
          // });
        }
        console.log(
          `Connection state change: ${this.peerConnection.connectionState}`
        );
      });

      this.peerConnection.addEventListener("signalingstatechange", () => {
        console.log(
          `Signaling state change: ${this.peerConnection.signalingState}`
        );
      });

      this.peerConnection.addEventListener("iceconnectionstatechange ", () => {
        console.log(
          `ICE connection state change: ${this.peerConnection.iceConnectionState}`
        );
      });
    },
    init() {
      //STEP 1: INIT THE CAMERA
      // document
      //   .querySelector("#cameraBtn")
      //   .addEventListener("click", this.openUserMedia);
      this.openUserMedia();
      this.joinRoom();
      document
        .querySelector("#hangupBtn")
        .addEventListener("click", this.hangUp);
      document
        .querySelector("#createBtn")
        .addEventListener("click", this.createRoom);
      document
        .querySelector("#joinBtn")
        .addEventListener("click", this.joinRoom);
    },
    async createRoom() {
      document.querySelector("#createBtn").disabled = true;
      document.querySelector("#joinBtn").disabled = true;
      const db = firebase.firestore();
      const roomRef = await db.collection("rooms").doc();

      console.log("Create PeerConnection with configuration: ", configuration);
      this.peerConnection = new RTCPeerConnection(configuration);
      console.log(this.peerConnection, "PC");
      this.registerPeerConnectionListeners();

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Code for collecting ICE candidates below
      const callerCandidatesCollection = roomRef.collection("callerCandidates");

      this.peerConnection.addEventListener("icecandidate", event => {
        if (!event.candidate) {
          console.log("Got final candidate!");
          return;
        }
        console.log("Got candidate: ", event.candidate, event, "E");
        callerCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above

      // Code for creating a room below
      console.log("this.peerConnection", this.peerConnection);
      const offer = await this.peerConnection.createOffer();
      localStorage.setItem("offer", offer);
      await this.peerConnection.setLocalDescription(offer);
      console.log("Created offer:", offer);

      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      };
      await roomRef.set(roomWithOffer);
      this.roomId = roomRef.id;
      this.createTitle = `Chat ID: ${this.roomId}`; //You are the caller!
      // this.closeModal();
      console.log(`New room created with SDP offer. Room ID: ${this.roomId}`);
      document.querySelector(
        "#currentRoom"
      ).innerText = `Current room is ${this.roomId} - You are the caller!`;
      // Code for creating a room above

      this.peerConnection.addEventListener("track", event => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log("Add a track to the remoteStream:", track);
          this.remoteStream.addTrack(track);
        });
      });

      // Listening for remote session description below
      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (
          !this.peerConnection.currentRemoteDescription &&
          data &&
          data.answer
        ) {
          console.log("Got remote description: ", data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await this.peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above

      // Listen for remote ICE candidates below
      roomRef.collection("calleeCandidates").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === "added") {
            let data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`
            );
            await this.peerConnection.addIceCandidate(
              new RTCIceCandidate(data)
            );
          }
        });
      });
      // Listen for remote ICE candidates above
      // this.joinRoom();
    },
    joinRoom() {
      console.log("J Room init");
      document.querySelector("#createBtn").disabled = true;
      document.querySelector("#joinBtn").disabled = true;

      ///document.querySelector("#confirmJoinBtn").addEventListener(
      console.log(
        this.$refs,
        this.$refs.confirm,
        "this.$refs.confirm",
        document.querySelector("#confirmJoinBtn")
      );
      this.$refs.confirm.addEventListener(
        "click",
        async () => {
          this.roomId = document.querySelector("#room-id").value;
          console.log("Join room: ", this.roomId);
          document.querySelector(
            "#currentRoom"
          ).innerText = `Current room is ${this.roomId} - You are the callee!`;
          this.joinRoomById(this.roomId);
        },
        { once: true }
      );
      // roomDialog.open();
    },
    async joinRoomById(roomId) {
      const db = firebase.firestore();
      const roomRef = db.collection("rooms").doc(`${roomId}`);
      const roomSnapshot = await roomRef.get();
      console.log("Got room:", roomSnapshot.exists, roomSnapshot.data());

      if (roomSnapshot.exists) {
        console.log(
          "Create PeerConnection with configuration: ",
          configuration
        );
        this.peerConnection = new RTCPeerConnection(configuration);
        this.registerPeerConnectionListeners();
        // if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
        // }

        // Code for collecting ICE candidates below
        const calleeCandidatesCollection = roomRef.collection(
          "calleeCandidates"
        );
        this.peerConnection.addEventListener("icecandidate", event => {
          if (!event.candidate) {
            console.log("Got final candidate!");
            return;
          }
          console.log("Got candidate: ", event.candidate, event, "ev");
          calleeCandidatesCollection.add(event.candidate.toJSON());
        });
        // Code for collecting ICE candidates above

        this.peerConnection.addEventListener("track", event => {
          console.log("Got remote track:", event.streams[0]);
          event.streams[0].getTracks().forEach(track => {
            console.log("Add a track to the remoteStream:", track);
            this.remoteStream.addTrack(track);
          });
        });

        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log("Got offer:", offer);
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await this.peerConnection.createAnswer();
        console.log("Created answer:", answer);
        await this.peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp
          }
        };
        await roomRef.update(roomWithAnswer);
        // Code for creating SDP answer above

        // Listening for remote ICE candidates below
        roomRef.collection("callerCandidates").onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            if (change.type === "added") {
              let data = change.doc.data();
              console.log(
                `Got new remote ICE candidate: ${JSON.stringify(data)}`
              );
              // const signalingChannel = new SignalingChannel(remoteClientId);
              // signalingChannel.addEventListener("message", message => {
              //   // New message from remote client received
              // });
              await this.peerConnection.addIceCandidate(
                new RTCIceCandidate(data)
              );
            }
          });
        });
        this.closeModal();
        // Listening for remote ICE candidates above
      }
    },
    openUserMedia(e) {
      const video = document.querySelector("#localVideo");
      console.log(e, "OPUSERMED");
      const hdConstraints = {
        video: { width: { min: 220 }, height: { min: 220 } }
      };
      return navigator.mediaDevices
        .getUserMedia(hdConstraints)
        .then(stream => {
          video.srcObject = stream;
          console.log("/* use the stream */", stream);

          this.localStream = stream;
          this.remoteStream = new MediaStream();
          console.log(this.remoteStream, "RS");
          document.querySelector("#remoteVideo").srcObject = this.remoteStream;

          console.log(
            "Stream:",
            document.querySelector("#localVideo").srcObject,
            "StreamRemote:",
            document.querySelector("#remoteVideo").srcObject
          );
          document.querySelector("#cameraBtn").disabled = true;
          document.querySelector("#joinBtn").disabled = false;
          document.querySelector("#createBtn").disabled = false;
          document.querySelector("#hangupBtn").disabled = false;
          // video.onloadedmetadata = function() {
          //   video.play();
          // };
        })
        .catch(function(err) {
          console.log("/* handle the error */", err);
        });
    },
    hangUp(e) {
      console.log(e);
      const tracks = document
        .querySelector("#localVideo")
        .srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });

      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
      }

      if (this.peerConnection) {
        this.peerConnection.close();
      }

      document.querySelector("#localVideo").srcObject = null;
      document.querySelector("#remoteVideo").srcObject = null;
      document.querySelector("#cameraBtn").disabled = false;
      document.querySelector("#joinBtn").disabled = true;
      document.querySelector("#createBtn").disabled = true;
      document.querySelector("#hangupBtn").disabled = true;
      document.querySelector("#currentRoom").innerText = "";

      // Delete room on hangup
      if (this.roomId) {
        const db = firebase.firestore();
        const roomRef = db.collection("rooms").doc(this.roomId);
        const calleeCandidates = roomRef.collection("calleeCandidates").get();
        calleeCandidates.forEach(async candidate => {
          candidate.ref.delete();
        });
        const callerCandidates = roomRef.collection("callerCandidates").get();
        callerCandidates.forEach(async candidate => {
          candidate.ref.delete();
        });
        roomRef.delete();
      }
      this.openModal();
      document.location.reload(true);
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
}
main {
  padding-top: 3rem;
  padding-bottom: 5rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#videos {
  display: none;
  flex-direction: column-reverse;
  justify-content: center;
  align-content: center;
  &.active {
    display: flex;
  }
  .video-one,
  .video-two {
    width: 100%;
    max-width: 400px;
    margin: auto;
    max-height: 300px;
    height: 100%;
    min-height: 300px;
    border: 1px solid #80808040;
    background-color: #80808066;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    position: relative;
    svg {
      position: absolute;
      left: calc(50% - 20px);
      height: 40px;
      width: 40px;
      fill: black;
      z-index: 1;
    }
    video {
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
}

@media only screen and (min-width: 800px) {
  #videos {
    display: none;
    flex-direction: row;
  }
}

.overlay {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10;
  top: 0;
  background-color: #00000094;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  transform-origin: center;
  visibility: hidden;
  transform: scale(0.75) translateY(100vw);
  transition: 0.4s ease-in-out;
  &.active {
    visibility: visible;
    transform: scale(1) translateY(0vw);
  }
  .mdc-dialog {
    background-color: white;
    max-width: 400px;
    width: 90%;
    margin: 0 auto;
    border-radius: 3px;

    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    transform: translate(0, -100vw);
    opacity: 0;
    transition: 0.5s ease-in-out;
    &.active {
      transform: translate(0vw);
      opacity: 1;
    }
    .tabs {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: row;
      button {
        width: 100%;
        height: 3rem;
        font-size: 1rem;
        background: linear-gradient(45deg, #4d968f, #075f56);
        color: white;
        border: 1px solid #042824;
        cursor: pointer;
        outline: none;
        transition: 0.3s ease-in-out;
        &.active {
          width: 100%;
          height: 3rem;
          font-size: 1rem;
          background: white;
          color: black;
          border: 1px solid white;
          &:hover {
            background: linear-gradient(180deg, #06645d70, white);
            color: black;
          }
        }

        &:hover {
          background: linear-gradient(45deg, #075f56, #008080);
          color: white;
        }
      }
    }
    .mdc-dialog__container {
      padding: 1rem;
      min-height: 200px;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      .create-container {
        .mdc-dialog__content {
          &.active {
            flex-direction: column;
          }
          .room-created-succ {
            .invite-container {
              position: relative;
            }
          }
          .mdc-text-field {
            position: relative;
            label {
              position: absolute;
              top: -0.58rem;
              left: 3rem;
              background-color: white;
              padding: 0 5px;
            }
          }
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: row;
          button {
            width: 80%;
            margin: 3rem 5%;
            height: 3rem;
            border-radius: 2px;
            font-size: 1rem;
            cursor: pointer;
            outline: none;
            transition: 0.3s ease-in-out;
            &.create {
              background-color: #008080;
              color: white;
              background: linear-gradient(45deg, #383667, #3c62b7);
              &:hover {
                background: linear-gradient(45deg, #3c62b7, #383667);
              }
            }
            &.cancel {
              background-color: #ff363691;
              color: white;
              background: linear-gradient(45deg, #73111e, #ff363691);
              &:hover {
                background: linear-gradient(45deg, #ff363691, #73111e);
              }
              &.active {
                background: black;
                margin: 0.5rem auto;
              }
            }
          }
        }
      }
    }
    .join-container {
      .mdc-text-field {
        position: relative;
        label {
          position: absolute;
          top: -0.58rem;
          left: 3rem;
          background-color: white;
          padding: 0 5px;
        }
      }
      .mdc-dialog__actions {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: row;
        button {
          width: 80%;
          margin: 3rem 5%;
          height: 3rem;
          border-radius: 2px;
          font-size: 1rem;
          cursor: pointer;
          outline: none;
          transition: 0.3s ease-in-out;
          &.create {
            background-color: #008080;
            color: white;
            background: linear-gradient(45deg, #383667, #3c62b7);
            &:hover {
              background: linear-gradient(45deg, #3c62b7, #383667);
            }
          }
          &.cancel {
            background-color: #ff363691;
            color: white;
            background: linear-gradient(45deg, #73111e, #ff363691);
            &:hover {
              background: linear-gradient(45deg, #ff363691, #73111e);
            }
          }
        }
      }
    }
    h2 {
      margin: 0;
    }
    .mdc-text-field {
      input {
        display: block;
        margin: auto;
        height: 2.5rem;
        border-radius: 3px;
        border: 1px solid gray;
        width: 80%;
      }
      .invite-container {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        width: 92%;
        margin: auto;
        input#room-id {
          display: block;
          margin: auto;
          height: 2.5rem;
          border-radius: 3px;
          border: 1px solid gray;
          width: 80%;
          margin: auto 0 auto auto;
        }
        button.add {
          width: 3rem;
          margin: 0;
          padding: 0;
          height: 2.75rem;
          font-size: 2rem;
        }
      }
    }
  }
}
</style>