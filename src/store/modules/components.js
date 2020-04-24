

export default {
    namespaced: true,
    state: {
      sendMessageModal:false,
      sideNavOpen:false,
      profileMenuOpen:false,
      blogMenuOpen:false,
      isOverlayActive:false,
      isOverlaySoft:false,
      peerConnection: null,
      localStream: null,
      remoteStream: null,
      roomDialog: null,
      roomId: null,
      videoCallStarted:false
    
    },
  
    mutations: {
      finishCall(state){
        console.log("[STORE MUTATIONS] - finishCall");
        state.videoCallStarted = false;
      },
      startCall(state){
        console.log("[STORE MUTATIONS] - startCall");
        state.videoCallStarted = true;
      },
      toggleSendMessage(state){
          console.log("[STORE MUTATIONS] - toggleSendMessageModal",);
          state.sendMessageModal = !state.sendMessageModal;
      },
      toggleSideNavOpen(state) {
          console.log("[STORE MUTATIONS] - toggleSideNavOpen",);
          // if(state.sideNavOpen){state.isOverlayActive = false}
          state.sideNavOpen = !state.sideNavOpen;
          console.log("sidenav toggled");
      },
      toggleProfileMenu(state){
          console.log("[STORE MUTATIONS] - toggleProfileMenu",);
          state.profileMenuOpen = !state.profileMenuOpen;
          if(state.blogMenuOpen == true){ state.blogMenuOpen = false}
          
      },
      toggleBlogMenuOpen(state){
          console.log("[STORE MUTATIONS] - toggleBlogMenuOpen",state.profileMenuOpen );
          state.blogMenuOpen = !state.blogMenuOpen;
          if(state.profileMenuOpen == true){ state.profileMenuOpen = false}
          
      },
      toggleOverlayOpen(state){
          console.log("[STORE MUTATIONS] - toggleOverlayOpen" );
          state.isOverlayActive = !state.isOverlayActive;
      },
      removeSoftOverlay(state){
          console.log("[STORE MUTATIONS] - removeSoftOverlay");
          state.isOverlaySoft = false;
      },
      addSoftOverlay(state){
          console.log("[STORE MUTATIONS] - addSoftOverlay",state.isOverlaySoft );
          state.isOverlaySoft = true;
      },
      overlayClicked(state){
          console.log("[STORE MUTATIONS] - overlayClicked");
          state.sendMessageModal =false;
          state.sideNavOpen =false;
          state.profileMenuOpen =false;
          state.blogMenuOpen =false;
          state.isOverlayActive =false;
          state.isOverlaySoft =false;
      },
    //   setPeerConnection(state,payload){
    //     console.log("[STORE MUTATIONS] - setPeerConnection");
    //     state.peerConnection = payload;
    //   },
    //   setLocalStream(state,payload){
    //     console.log("[STORE MUTATIONS] - setLocalStream");
    //     state.localStream = payload
    //   },
    //   setRemoteStream(state,payload){
    //     console.log("[STORE MUTATIONS] - setRemoteStream");
    //     state.remoteStream = payload
    //   },
    //   setRoomDialog(state,payload){
    //     console.log("[STORE MUTATIONS] - setRoomDialog");
    //     state.roomDialog = payload
    //   },
    //   setRoomId(state){
    //     console.log("[STORE MUTATIONS] - setRoomId");

    //   },
      
  
    },
    getters:{
      sideNavOpen(state) {
          return state.sideNavOpen;
        },
  
    },
    actions: {
  
  
    }
  }
  