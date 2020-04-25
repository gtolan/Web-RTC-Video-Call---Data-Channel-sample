import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../views/HomePage.vue";
//import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    meta: {
      title: 'Web RTC - Vuejs - Sammple App',
    }
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: 'Login - Web RTC sample'
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  },
  {
    path: "/video-call",
    name: "VideoCall",
    meta: {
      title: 'Video Call - Web RTC sample'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/VideoCall.vue")
  },
  {
    path: "/dashboard",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Dashboard.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
