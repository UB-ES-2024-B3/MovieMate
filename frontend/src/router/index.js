import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/User/Login.vue';
import PerfilUsuario from '../components/User/PerfilUsuario.vue';
import Register from "../components/User/Register.vue";
import EditarPerfil from "../components/User/EditarPerfil.vue";
import RecuperarContrasena from "@/components/User/RecuperarContrasena.vue";
import MovieCard from "@/components/Movie/MovieCard.vue";
import PublicarResena from "@/components/Movie/PublicarResena.vue";
import PeliculasFavoritas from "@/components/User/PeliculasFavoritas.vue";
import MovieReview from "@/components/Movie/MovieReview.vue";
import PostCard from "@/components/Posts/PostCard.vue";
import CommentDetails from "@/components/Comment/CommentDetails.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/comment/:commentId', component: CommentDetails},
  { path: '/post/:postId', component: PostCard},
  { path: '/login', component: Login },
  { path: '/user/:userName', component: PerfilUsuario},
  { path: '/register', component: Register},
  { path: '/editar', component: EditarPerfil},
  { path: '/recovery/:token', component: RecuperarContrasena},
  { path: '/movie/:title', component: MovieCard},
  { path: '/resena/:movieId/:userId', component: PublicarResena},
  { path: '/favorites', component: PeliculasFavoritas},
  { path: '/review/:id', component: MovieReview},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;

