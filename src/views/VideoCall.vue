<template>
  <section>
    <div class="controls" v-show="!isModalOpen">
      <button
        class="hangup mdc-button mdc-button--raised"
        @click="handleHangUp"
        disabled
        id="hangupBtn"
      >
        <span class="mdc-button__label">Hangup</span>
      </button>
      <button class="open-modal" @click="openModal">Open Modal</button>
      <button class="camera" @click="openCamera">Camera</button>
      <button class="close-room" @click="fullHangUpCloseRoom">Close Room</button>
    </div>
    <main>
      <div>
        <span id="currentRoom"></span>
      </div>
      <section id="videos" :class="{'active':!isModalOpen}">
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
      </section>

      <section class="messages" v-show="!isModalOpen">
        <div class="sent-messages" v-if="messageList.length >= 1">
          <div
            class="message"
            :class="{'right':item.side == 'right','left': item.side == 'left'}"
            v-for="(item, ind) in messageList"
            :key="ind"
          >{{item.data}}</div>
        </div>
        <form @submit.prevent="sendTextMessage">
          <textarea
            class="text-area"
            placeholder="your message ..."
            rows="4"
            v-model="textareaInput"
            resize="none"
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
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
              <!-- <h2 class="mdc-dialog__title" id="my-dialog-title">Join a live room</h2> -->
              <div class="mdc-dialog__content" id="my-dialog-content">
                <p>Enter the room ID to join:</p>
                <div class="mdc-text-field">
                  <input type="text" :value="roomId" id="room-id" class="mdc-text-field__input" />
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
              <!-- <h2>{{createTitle}}</h2> -->
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
                      :value="roomId"
                      class="mdc-text-field__input"
                    />
                    <button v-clipboard:copy="roomId" class="add">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
                        />
                      </svg>
                      <!-- <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"
                        />
                      </svg>-->
                    </button>
                    <label class="mdc-floating-label" for="my-text-field">Share this Code</label>
                  </div>
                  <div class="mdc-line-ripple">
                    <button class="continue" @click="closeModal">Continue to Room</button>
                  </div>
                </div>

                <button
                  @click="closeModal"
                  :class="{'active':roomCreated}"
                  type="button"
                  class="mdc-button mdc-dialog__button cancel"
                  v-if="!roomCreated"
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
    <!-- <Contacts /> -->
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import firebase from "firebase";

// import Contacts from "@/components/Contacts.vue";
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
    }
  ],
  iceCandidatePoolSize: 1
};
export default {
  name: "VideoCall",
  components: {
    //Contacts
  },
  data() {
    return {
      textareaInput: "",
      messageList: [],
      iEndedTheCall: false,
      erroMsg: "",
      isModalOpen: true,
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      roomDialog: null,
      roomId: "Amaql6GHleS2FAIsJeML",
      joinOption: false,
      roomCreated: false,
      createTitle: "Create a chat room",
      roomRef: null,
      isRestartingRoomFromCaller: false,
      renderComponent: true,
      sendDCMessage: null,
      dc: null,
      sendMessageAsCallee: null //will be fn on load
    };
  },
  computed: {},
  methods: {
    ...mapMutations(["components/startCall", "components/finishCall"]),

    setTab(tab) {
      tab == "join" ? (this.joinOption = true) : (this.joinOption = false);
      // tab == "join" ? this.joinRoom() : null;
    },
    hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },
    closeModal() {
      this.isModalOpen = false;
      this["components/startCall"]();
    },
    openModal() {
      this.isModalOpen = true;
      this["components/finishCall"]();
    },
    handleCreateChatRoom() {
      this.openUserMedia();
      this.createRoom();
      this.roomCreated = true;
    },
    openCamera() {
      // this.openUserMedia().then(() => {
      //   console.log("feed stream after open cmaera");
      //   this.feedStreamToPeer();
      // });
    },
    autoCreateChatRoom() {
      let hostRefresh = localStorage.getItem("hostRefresh");
      if (hostRefresh) {
        // let db = firebase.firestore();
        // db.collection("rooms")
        //   .doc(this.roomId)
        //   .set({ status: "creatingNewRoom" });
        this.createRoom();
        this.roomCreated = true;
      }
    },

    restartConnection() {
      if (!localStorage.getItem("hostEndedCall")) {
        this.peerConnection = null;
        this.remoteStream = null;

        document.querySelector("#remoteVideo").srcObject = this.remoteStream;
        // this.openUserMedia().then(() => {
        //   console.log("restart camer and create new room");

        this.roomRef.set({ status: "refresh" });
        // });
        console.log("EXPECT - after create - change staus");
        this.isRestartingRoomFromCaller = true;
        this.openUserMedia().then(() => {
          console.log("restart camer and create new room");
          this.createRoom();
        });
      }
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
        }
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
      // const db = firebase.firestore();
      // const roomRef = db.collection("rooms").doc(this.roomId);

      // // const checkForCallers = () => {
      // this.openUserMedia().then(() => {
      //   roomRef
      //     .collection("callerCandidates")
      //     .doc("callers")
      //     .get()
      //     .then(doc => {
      //       if (!doc.exists) {
      //         console.log("No such document!");
      //         this.autoCreateChatRoom();
      //         return; //false;
      //       } else {
      //         console.log("Document data:", doc.data());
      //         //true;
      //         this.addJoinRoomEvent();
      //         return;
      //       }
      //     })
      //     .catch(err => {
      //       console.log("Error getting document", err);
      //     });
      // });
      //};
      //console.log(callees, callers);

      //STEP 1: INIT THE CAMERA
      const startJoinRoom = () => {
        this.openUserMedia().then(() => {
          this.addJoinRoomEvent();
        });
      };
      startJoinRoom();
      if (localStorage.getItem("restartConnection")) {
        //this.restartConnection();
        this.autoCreateChatRoom();
        localStorage.removeItem("restartConnection");
      }

      //Step 2: Add events for Join Room

      window.onbeforeunload = () => {
        console.log("before unload - before connection closed in DChannel");

        let isCallee = localStorage.getItem("isCallee");
        if (isCallee) {
          this.handleHangUp();
          localStorage.setItem("isCallee", true);
        } else {
          console.log("refresh HOST");
          this.handleHangUp();
          localStorage.setItem("restartConnection", true);

          //localStorage.setItem("hostRefresh", true);
        }
        // let isCallee = localStorage.getItem("isCallee");
        // if (isCallee) {
        //   this.deleteFSREcords();
        //   this.sendStateMessage("REOFFER");
        //   this.hangUpConnections();
        // }
      };
    },
    feedStreamToPeer() {
      // Code for feeding stream to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      return;
    },
    getIceCallerCandidatesAndWriteToFSonComplete() {
      const callerCandidatesCollection = this.roomRef.collection(
        "callerCandidates"
      );
      // const writeAllCandidatesToFS = ()=>{

      // }

      let candidateColl = [];
      const writeAllCandidatesToFS = () => {
        console.log("writeAllCandidatesToFS");
        callerCandidatesCollection
          .doc("callers")
          .set({ callers: candidateColl });
        let restart = this.isRestartingRoomFromCaller;
        if (restart) {
          this.roomRef.update({ status: "refresh" });
          // this.isRestartingRoomFromCaller = false;
        }
      };

      this.peerConnection.addEventListener("icecandidate", event => {
        if (!event.candidate) {
          console.log(
            "Got final candidate!",
            "isRestartingRoomFromCaller",
            this.isRestartingRoomFromCaller
          );
          if (this.isRestartingRoomFromCaller) {
            this.isRestartingRoomFromCaller = false;
          }
          return writeAllCandidatesToFS();
        } else {
          candidateColl.push(event.candidate.toJSON());
        }
        console.log("Got candidate for Caller: ", event.candidate, event, "E");
        //TODO - test return once not three times? - currently adding all candidates
      });
      return;
    },
    getIceCalleeCandidatesAndWriteToFSonComplete() {
      const calleeCandidatesCollection = this.roomRef.collection(
        "calleeCandidates"
      );
      let candidateColl = [];
      const writeAllCandidatesToFS = () => {
        console.log("writeAllCandidatesToFS");
        calleeCandidatesCollection
          .doc("callees")
          .set({ callees: candidateColl });
      };
      // calleeCandidatesCollection.doc("callees").set({ callees: candidateColl });
      this.peerConnection.addEventListener("icecandidate", event => {
        if (!event.candidate) {
          console.log("Got final candidate for Callee!");
          return writeAllCandidatesToFS();
        } else {
          candidateColl.push(event.candidate.toJSON());
        }
        console.log("Got candidate: ", event.candidate, event, "ev");
      });
    },
    async createOfferToPeerSetLocalDescription() {
      const offer = await this.peerConnection.createOffer();

      //Await peer connection setLocalDescription and set offer
      await this.peerConnection.setLocalDescription(offer);
      console.log("Created offer:", offer);
      //After setting LocalDesc offer - write it to Room Ref
      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      };
      //Set offer to Room Ref - As the caller
      this.roomRef.set(roomWithOffer);
      this.roomId = "Amaql6GHleS2FAIsJeML";

      localStorage.setItem("host", this.roomId);
      this.createTitle = `Chat ID: ${this.roomId}`; //You are the caller!

      console.log(`New room created with SDP offer. Room ID: ${this.roomId}`);
      document.querySelector(
        "#currentRoom"
      ).innerText = `Current room is ${this.roomId} - You are the caller!`;
      return;
      // Code for creating a room above
    },
    lookForPeerTrackToFeedToRemoteVideoElem() {
      this.peerConnection.addEventListener("track", event => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log("Add a track to the remoteStream:", track);
          this.remoteStream.addTrack(track);
        });
      });
    },
    //       textareaInput:'',
    // messageList: [],
    // sendTextMessage
    sendTextMessage() {
      let host = localStorage.getItem("host");
      if (host) {
        this.sendMessageAsCaller(this.textareaInput);
      } else {
        this.sendMessageAsCallee(this.textareaInput);
      }
    },
    sendStateMessage(msg) {
      let host = localStorage.getItem("host");
      if (host) {
        this.sendMessageAsCaller(msg);
      } else {
        this.sendMessageAsCallee(msg);
      }
    },
    restartItem() {
      const removeCandidates = () => {
        let db = firebase.firestore();
        db.collection("rooms")
          .doc(this.roomId)
          .delete();
      };
      if (!localStorage.getItem("isCallee")) {
        console.log("reload ...");
        removeCandidates();
        this.remoteStream = new MediaStream();
        console.log(this.remoteStream, "RS");
        document.querySelector("#remoteVideo").srcObject = this.remoteStream;
        this.createRoom();
        return;
      }
    },
    sendMessageAsCaller(msg) {
      // let obj = {
      //   message: msg,
      //   timestamp: new Date()
      // };
      let obj = { side: "right", data: msg };
      //return this.dc.send(JSON.stringify(obj));
      console.log("sen msg as caller", msg);
      this.messageList.push(obj);
      this.dc.send(JSON.stringify({ ...obj, side: "left" }));
      return (this.textareaInput = "");
    },
    addMessagingChannel(dc) {
      dc.onmessage = event => {
        console.log("received: " + event.data);
        let obj = JSON.parse(event.data);
        if (obj.data != "REOFFER") {
          this.messageList.push(obj);
        } else {
          //Tested this but close worked before unload
          //this.restartConnection();
        }
      };

      dc.onopen = () => {
        console.log("datachannel open");

        console.log("is host send mess");
        // this.sendMessageAsCaller("Host Connection");
        // dc.send("HOST HERE");
      };

      dc.onclose = () => {
        this.restartConnection();
        console.log("datachannel close");
      };
    },

    addMessagingChannelCallee(pc) {
      pc.ondatachannel = event => {
        let channel = event.channel;
        channel.onopen = () => {
          this.sendMessageAsCallee = msg => {
            let obj = { side: "right", data: msg };
            this.messageList.push(obj);
            channel.send(JSON.stringify({ ...obj, side: "left" }));
          };
          // this.sendMessageAsCallee("Hi back!");
          // channel.send("Hi back!", "channel", event);
        };
        channel.onmessage = event => {
          if (event.data != "REOFFER") {
            let obj = JSON.parse(event.data);
            this.messageList.push(obj);
          } else {
            //this.restartConnection();
          }
        };
        channel.onclose = function(event) {
          console.log(event.data, "channel");
        };
      };
    },
    async createRoom() {
      // Setup firebase database ref
      const db = firebase.firestore();
      // const db = firebase.firestore();
      //   const roomRef = db.collection("rooms").doc(`${roomId}`);
      let host = localStorage.getItem("host");
      console.log(host, "= open chat write id", "CREATE ROOM!!!");
      let roomRef;
      if (!host) {
        roomRef = await db.collection("rooms").doc("Amaql6GHleS2FAIsJeML");
      } else {
        roomRef = await db.collection("rooms").doc(host);
      }
      this.roomRef = roomRef;
      console.log("Create PeerConnection with configuration: ", configuration);
      // Create peer connection with ICE servers
      this.peerConnection = new RTCPeerConnection(configuration);
      this.dc = this.peerConnection.createDataChannel("RTCDataChannel");

      this.addMessagingChannel(this.dc);

      console.log(this.peerConnection, "NEW PC created - add listeners");
      // Add event listeners to peer connection
      this.registerPeerConnectionListeners();

      this.feedStreamToPeer();
      //TODO : checkmoving this to init camaera state

      // Code for collecting ICE candidates below
      //return candidates from peer connection event

      this.getIceCallerCandidatesAndWriteToFSonComplete();

      // Code for creating a room OFFER below
      console.log("this.peerConnection", this.peerConnection);
      this.createOfferToPeerSetLocalDescription();
      //Look for Peer connection track using listener
      this.lookForPeerTrackToFeedToRemoteVideoElem(); //Feed peer stream to remote video elem

      // Listening for remote session description below
      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (
          !this.peerConnection.currentRemoteDescription &&
          data &&
          data.answer
        ) {
          console.log(
            "Got remote description: ",
            data.answer,
            this,
            "THIS snap"
          );
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await this.peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above

      // Listen for remote ICE candidates below
      // Write
      roomRef.collection("calleeCandidates").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === "added") {
            let data = change.doc.data().callees;
            // this.restartItem();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`,
              "now NOT KEYED - SET instead of ADD"
            );
            data.forEach(dataItem => {
              this.peerConnection.addIceCandidate(
                new RTCIceCandidate(dataItem)
              );
            });
          }
        });
      });
    },
    addJoinRoomEvent() {
      console.log("J Room init");
      localStorage.getItem("roomOpen")
        ? (this.roomId = localStorage.getItem("roomOpen"))
        : "";
      console.log(this.$refs, this.$refs.confirm, "this.$refs.confirm");

      // );
      this.$refs.confirm.addEventListener(
        "click",
        async () => {
          this.roomId = document.querySelector("#room-id").value;
          console.log("Join room: ", this.roomId);
          document.querySelector(
            "#currentRoom"
          ).innerText = `Current room is ${this.roomId} - You are the callee!`;
          this.joinRoomById(this.roomId);
          localStorage.setItem("roomOpen", this.roomId);
        },
        { once: true }
      );
      if (
        localStorage.getItem("isCallee") &&
        localStorage.getItem("roomOpen")
      ) {
        console.log("is Callee", "auto join", this.roomId);
        //this.isModalOpen = false;
        this.closeModal();
        return this.joinRoomById(this.roomId);
      }
    },

    async joinRoomById(roomId) {
      const db = firebase.firestore();
      const roomRef = db.collection("rooms").doc(`${roomId}`);
      this.roomRef = roomRef;
      console.log("roomId", roomId);
      //const roomRef = db.collection("rooms").doc("chat");
      localStorage.setItem("isCallee", true);
      const roomSnapshot = await roomRef.get();
      console.log("Got room:", roomSnapshot.exists, roomSnapshot.data());
      // const roomCallerSnapshot = await roomRef
      // .collection("callerCandidates")
      // .get();
      const listenForCandidates = () => {
        roomRef.collection("callerCandidates").onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {
            if (change.type === "added") {
              let data = change.doc.data().callers;
              console.log(
                `Got new remote ICE candidate "SS": ${JSON.stringify(data)}`
              );
              data.forEach(dataItem => {
                this.peerConnection.addIceCandidate(
                  new RTCIceCandidate(dataItem)
                );
              });
            }
          });
        });
      };
      const startConnection = async () => {
        document.querySelector(".video-two").classList.remove(".reload");
        console.log("start connection");
        this.peerConnection = new RTCPeerConnection(configuration);
        // this.dc = this.peerConnection.createDataChannel("RTCDataChannel");  //dont create if not host
        // this.sendDCMessage = dc.send;
        // this.sendDCMessage("reciever opened connection");
        this.addMessagingChannelCallee(this.peerConnection);
        this.registerPeerConnectionListeners();
        this.feedStreamToPeer();
        //this.getIceCandidatesAndWriteToFSonComplete(); //// Code for collecting ICE candidates
        this.getIceCalleeCandidatesAndWriteToFSonComplete();
        this.lookForPeerTrackToFeedToRemoteVideoElem();
        //This may need to go after the offer stage below ?

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
        listenForCandidates();
        // Code for creating SDP answer above
        this.closeModal();
      };

      if (
        roomSnapshot.exists
        // roomSnapshot.exists //&&
        // roomSnapshot.data().status != "creatingNewRoom" //Dont allow normal start if room is in creation stage - wait on snap!!
      ) {
        console.log(
          "Create PeerConnection with configuration: ",
          configuration
        );

        return startConnection();
        // Listening for remote ICE candidates above
      } else {
        console.log("NO snap"); //Needed to Refresh the Callee after the new offer is ready
        // roomRef.onSnapshot(docSnapshot => {
        //   let data = docSnapshot.data() || false;
        //   console.log("data", data);
        //   if (data) {
        //     let status = data.status || false;
        //     console.log("status", status);
        //     if (status) {
        //       roomRef.update({ status: "refreshComplete" });
        //       return startConnection();
        //     }
        //   }
        // });
        const db = firebase.firestore();
        const roomRef = db.collection("rooms").doc(`${roomId}`); //Check if will help - as undefined will not check for changes
        roomRef.onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              console.log("New ADded: ", change.doc.data());
            }
            if (change.type === "modified") {
              console.log("Modified: ", change.doc.data());
            }
            if (change.type === "removed") {
              console.log("Removed city: ", change.doc.data());
            }
          });
        });
      }

      // roomRef.onSnapshot(async snapshot => {
      //   const data = snapshot.data();
      //   console.log(data, "NOSNA");
      //   if (data.offer) {

      //creatingNewRoom before
      // if (data.status == "refreshComplete") {
      //   console.log("refresh compleet - start coonection now");
      //   // document.querySelector(".video-two").classList.add(".reload");
      //   localStorage.removeItem("resarting");
      //   localStorage.setItem("refreshComplete", true);

      // // roomRef.update({ status: "reconnecting" });
      // // return startConnection();

      // //}
      //    }
      //   //    });
      // }
      // Listening for remote ICE candidates below
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

          document.querySelector("#hangupBtn").disabled = false;
        })
        .catch(function(err) {
          //ADvise the user to allow permission for the camera / audio
          console.log("/* handle the error */", err);
        });
    },

    deleteFSREcords() {
      // Delete room on hangup
      if (this.roomId) {
        console.log(this.roomId, "roomId Closed");
        const db = firebase.firestore();
        const roomRef = db.collection("rooms").doc(this.roomId);
        // console.log(roomRef, "roomRef");
        //const calleeCandidates =
        roomRef
          .collection("calleeCandidates")
          .doc("callees")
          .delete();
        roomRef
          .collection("callerCandidates")
          .doc("callers")
          .delete();

        //roomRef.delete();   Need to keep this for update Status - DEstroy instance after the caht is over
      }
    },
    hangUpConnections() {
      console.log("HANLE HANGUP");
      this.iEndedTheCall = true;

      const tracks = document
        .querySelector("#localVideo")
        .srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });

      // if (!localStorage.getItem("isCallee")) {

      //   localStorage.setItem("hostEndedCall", true);
      // }

      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
      }

      if (this.peerConnection) {
        this.peerConnection.close();
      }

      document.querySelector("#localVideo").srcObject = null;
      document.querySelector("#remoteVideo").srcObject = null;

      document.querySelector("#hangupBtn").disabled = true;
      document.querySelector("#currentRoom").innerText = "";
    },
    handleHangUp() {
      this.deleteFSREcords();
      this.hangUpConnections();
      this.roomCreated = false;
      this.openModal();

      // document.location.reload(true);
    },
    fullHangUpCloseRoom() {
      this.deleteFSREcords();
      this.hangUpConnections();
      this.roomCreated = false;
      this.openModal();
      this.roomRef.delete();
      localStorage.clear();
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
  padding-bottom: 0;
  margin-bottom: 5rem;
  min-height: 100vh;
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
    &.reload {
      svg {
        fill: red;
      }
    }
    video {
      width: 100%;
      height: 100%;
      z-index: 2;
      height: 300px;
      width: 400px;
      z-index: 2;
      justify-content: center;
      min-height: 300px;
      min-width: 400px;
      max-height: 100%;
    }
  }
}

@media only screen and (max-width: 500px) {
  #videos {
    .video-one {
      position: fixed;
      top: 4rem;
      width: 7rem;
      height: 5rem;
      right: 0;
      min-height: 0;
      z-index: 9;
      video {
        height: 100%;
        width: 100%;
        z-index: 2;
        justify-content: center;
        min-height: 100%;
        min-width: 100%;
        max-height: 100%;
      }
    }
  }
}

@media only screen and (max-width: 500px) {
  .overlay .mdc-dialog .mdc-dialog__container {
    padding: 0.51rem;
  }
  .overlay
    .mdc-dialog
    .mdc-dialog__container
    .create-container
    .mdc-dialog__content
    button.create,
  .overlay
    .mdc-dialog
    .mdc-dialog__container
    .create-container
    .mdc-dialog__content
    button.cancel,
  .overlay .mdc-dialog .join-container .mdc-dialog__actions button.create,
  .overlay .mdc-dialog .join-container .mdc-dialog__actions button.cancel {
    margin: 1.5rem 2%;
  }
  .overlay .mdc-dialog .mdc-text-field input {
    display: block;
    margin: auto;
    height: 2.5rem;
    border-radius: 3px;
    border: 1px solid gray;
    width: 90%;
    padding-left: 10px;
    font-size: 0.8rem;
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
  z-index: 9;
  top: 0;
  background-color: #000000d9;
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
        background: linear-gradient(45deg, #1e90ff, #1c63a9);
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
            background: linear-gradient(45deg, #070a5f, #1e90ff);
            background: linear-gradient(180deg, #1e85eb6b, white);
            color: black;
          }
        }

        &:hover {
          background: linear-gradient(45deg, #075f56, #008080);
          background: linear-gradient(45deg, #070a5f, #1e90ff);
          color: white;
        }
      }
    }
    .mdc-dialog__container {
      padding: 1rem;
      // min-height: 200px;
      min-height: 140px;
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
            margin: 1rem 5%;
            height: 3rem;
            border-radius: 2px;
            font-size: 1rem;
            cursor: pointer;
            outline: none;
            transition: 0.3s ease-in-out;
            &.create {
              color: #13675f;
              border: 1px solid green;
              color: #1d6ebe;
              border: 1px solid #1e88f0;
              background: white;
              &:hover {
                background: linear-gradient(45deg, #1e88f0, dodgerblue);
                color: white;
              }
            }
            &.cancel {
              background-color: white;
              color: #ff363691;
              border: 1px solid #ff363691;
              &:hover {
                color: white;
                background: linear-gradient(45deg, #73111e, #ff363691);
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
          margin: 1.5rem 5%;
          height: 3rem;
          border-radius: 2px;
          font-size: 1rem;
          cursor: pointer;
          outline: none;
          transition: 0.3s ease-in-out;

          &.create {
            color: #13675f;
            border: 1px solid green;
            background: white;
            color: #1d6ebe;
            border: 1px solid #1e88f0;
            background: white;
            &:hover {
              background: linear-gradient(45deg, #1e88f0, dodgerblue);
              color: white;
            }
          }

          &.cancel {
            background-color: white;
            color: #ff363691;
            border: 1px solid #ff363691;
            &:hover {
              color: white;
              background: linear-gradient(45deg, #73111e, #ff363691);
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
        width: calc(80% - 15px);
        margin-left: 0;
        font-size: 1rem;
        padding-left: 15px;
      }
      input#room-id {
        width: calc(89% - 15px);
        margin-left: 0;
        margin: auto;
        padding-left: 15px;
        font-size: 1rem;
      }
      .invite-container {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        width: 92%;
        width: 81%;
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
          border: 1px solid dodgerblue;
          background-color: gainsboro;
          transition: 0.3s ease-in-out;
          svg {
            fill: #1d6cbb;
          }
          &:hover {
            background-color: dodgerblue;
            svg {
              fill: white;
            }
          }
        }
      }
    }
  }
}
.open-modal {
  margin-top: 5rem;
}
section.messages {
  position: relative;
  min-height: 200px;
  margin: auto;
  width: 100vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  padding-bottom: 150px;
  .sent-messages {
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-left: calc(50vw - 200px);
    border: 1px solid grey;
    padding: 1rem 0;
    border-radius: 8px;
    .message {
      padding: 10px 0;
      border: 1px solid gainsboro;
      border-radius: 2px;
      margin: 4px 21px;
      width: 81%;
      &.left {
        text-align: left;
        margin-right: auto;
        padding-left: 10px;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-right-color: #dcdcdc;
          border-left: 0;
          border-top: 0;
          margin-top: -10px;
          margin-left: -15px;
        }
      }
      &.right {
        text-align: right;
        position: relative;
        margin-left: auto;
        padding-right: 10px;
        &:after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          width: 0;
          height: 0;
          border: 15px solid transparent;
          border-left-color: #dcdcdc;
          border-right: 0;
          border-bottom: 0;
          margin-top: -10px;
          margin-right: -15px;
        }
      }
    }
  }
  form {
    position: absolute;
    bottom: 0;
    min-height: 150px;
    padding-bottom: 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-left: calc(50vw - 200px);
    .text-area {
      height: 100px;
      width: 388px;
      resize: none;
      border-radius: 8px;
      margin: 10px 0px;
      outline: none;
      font-size: 0.9rem;
      padding: 5px;
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
    }
  }
}

.controls {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 4rem;
  button {
    cursor: pointer;
    outline: none;
    transition: 0.3s ease-in-out;
    height: 2rem;
    min-width: 100px;
    margin: 10px;
    border-radius: 3px;
    &.hangup,
    &.open-modal {
      color: #13675f;
      border: 1px solid green;
      background: white;
      color: #1d6ebe;
      border: 1px solid #1e88f0;
      background: white;
      &:hover {
        background: linear-gradient(45deg, #1e88f0, dodgerblue);
        color: white;
      }
    }
  }
}

@media only screen and (max-width: 500px) {
  section.messages {
    margin: auto 5%;
    width: 90vw;
    .sent-messages {
      display: flex;
      flex-direction: column;
      width: 400px;
      margin: 0 auto;
      border: 1px solid #8080808f;
      padding: 1rem 0;
      border-radius: 8px;
      max-width: 100%;
    }
    form {
      width: 100%;
      margin-left: 0;

      .text-area {
        height: 100px;

        width: calc(100% - 4px);
        resize: none;
        border-radius: 8px;
        margin: 10px 0px;
        outline: none;
        font-size: 0.9rem;
        border: 1px solid #8080808f;
        margin-left: 2px;
      }
    }
  }
}

.continue {
  color: #1d6ebe;
  border: 1px solid #1e88f0;
  background: white;
  transition: 0.3s ease-in-out;
  &:hover {
    background: #1e88f0;
    color: white;
  }
}
</style>
