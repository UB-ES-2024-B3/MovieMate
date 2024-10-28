import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import PerfilUsuario from '../components/PerfilUsuario.vue';
import Register from "../components/Register.vue";
import Editar from "../components/Editar.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/user/:userName', component: PerfilUsuario},
  { path: '/register', component: Register},
  { path: '/editar', component: Editar},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

