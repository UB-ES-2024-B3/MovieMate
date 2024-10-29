import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/User/Login.vue';
import PerfilUsuario from '../components/User/PerfilUsuario.vue';
import Register from "../components/User/Register.vue";
import EditarPerfil from "../components/User/EditarPerfil.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/user/:userName', component: PerfilUsuario},
  { path: '/register', component: Register},
  { path: '/editar', component: EditarPerfil},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

