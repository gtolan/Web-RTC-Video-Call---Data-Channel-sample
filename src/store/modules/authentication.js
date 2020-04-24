import firebase from 'firebase';


export default {
  namespaced: true,
  state: {
    uid:null,
    user:null,
    loginNavbar:false,
    token: localStorage.getItem('token') || null,
    users:[{uid:'',
            displayName:'',
            email:'',
            online:false,
            messages:[{toUser:'',fromUser:'',message:'',time:''}]
        }]
  },
  mutations: {
    saveUID(state, uid) {
        console.log("[STORE MUTATIONS] - saveUID:", uid);
        state.uid = uid;
      },
      setUSER(state, user) {
        console.log("[STORE MUTATIONS] - setUSER:", user);
        state.user = user;
      },
      setTOKEN(state, token) {
        console.log("[STORE MUTATIONS] - setTOKEN:", token);
        state.token = token;
      },
      writeUsersList(state, users){
        console.log("[STORE MUTATIONS] - writeUsersList:", users);
        state.users = users;
      },
      toggleLoginNavbar(state){
        console.log("[STORE MUTATIONS] - toggleLoginNavbar:");
        state.loginNavbar = !state.loginNavbar
      }

  },
    getters:{

      },
      actions: {
        async signInWithEmailAndPassword({commit},user) {
            console.log('user to sign in', user.email, user.password)
        await firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(firebaseUser => {
          console.log(firebaseUser.user, "FBU", firebaseUser.user.uid, "UID");
          console.log("[STORE ACTIONS] - login", user, "user");
           const userInfo = {
              email: user.email,
              uid: user.uid
            };
            commit("setUSER", userInfo);
            commit("saveUID", userInfo.uid);
          return "Success!" //.userdispatch("login",firebaseUser.user);
        //  return this.login(firebaseUser.user);
        }).catch(error => {
            return error.message;
        });

    },
    async login({ commit }) {
            
            const token = await firebase.auth().currentUser.getIdToken(true);
            localStorage.setItem('token', token)
            commit("setTOKEN", token);
            console.log("[STORE ACTIONS] - in login, response:", status);
          },
    async writeUserToDB({commit},payload){
        console.log(payload, "USER");
          
            let addDocRef = firebase.firestore().collection('users');
            const{ email, uid} = payload.user;
            const {displayName = "", online = false} = payload;
            const newUser = {email,uid,displayName,online}
              //return addDocRef.add(
                await addDocRef.doc(`${uid}`).set(
                newUser).then(ref => {
                console.log(ref)
                commit("saveUID", uid);
              });
    },
    async register({dispatch,commit}, payload) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            firebaseUser => {
                console.log(firebaseUser, "FU")
                const userInfo = {
                    email: firebaseUser.user.email,
                    uid: firebaseUser.user.uid
                  };
                  commit("setUSER", userInfo);
                  commit("saveUID", userInfo.uid);
              dispatch("login");
              dispatch("writeUserToDB", firebaseUser);
                // console.log(firebaseUser.user, firebaseUser)
              return firebaseUser;
            },
            err => {
              // this.errorMsg = err.message;
              alert("Oops. " + err.message);
            }
          )
    },
    async logout({ commit }, uid) {
        console.log("[STORE ACTIONS] - logout", uid, "uid");
        await firebase.auth().signOut();
        //Cookies.remove('access_token');
    
        let updDocRef = firebase.firestore().collection(`users/`).doc(`${uid}`) 
        updDocRef.update({online: false});
        localStorage.removeItem('token')
        commit("setUSER", null);
        commit("saveUID", null);
      },
    async fetchUsers({ commit }){
        console.log("[STORE ACTIONS] - fetchUsers:", );
         await firebase.firestore().collection('users').onSnapshot(docSnapshot => {
          console.log(`Received doc snapshot: ${docSnapshot.docs}`);
          docSnapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
          });
          let users = []
          docSnapshot.forEach(doc => {
              let data= doc.data();
              return users.push({...data, id:doc.id});
            });
            console.log('WAA', users)
          commit("writeUsersList", users);
        //   commit("saveUsersList", docSnapshot);
          //  return docSnapshot
          // ...
          return docSnapshot
        }, err => {
          console.log(`Encountered error: ${err}`);
        })
      },
}
}