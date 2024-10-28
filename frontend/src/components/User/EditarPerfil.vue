<template>
  <div class="container mx-auto p-8">
    <h2 class="text-2xl font-bold text-center mb-8 form_title_text">Editar Perfil</h2>

    <form @submit.prevent="updateUserProfile">
      <!-- Nombre de usuario -->
      <div class="mb-4">
        <label for="nombre" class="block mb-2 text-sm font-medium form_title_text">UserName</label>
        <input type="text" name="userName" v-model="formData.userName" id="nombre" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Your username" required="">
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block mb-2 text-sm font-medium form_title_text">Email</label>
        <input type="text" name="userName" v-model="formData.email" id="nombre" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Your username" required="">
      </div>

      <!-- Género -->
      <div class="mb-4">
        <label for="gender" class="block mb-2 text-sm font-medium form_title_text">Gender</label>
        <select id="gender" name="gender" v-model="formData.gender" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
          <option value="" disabled selected>Select a gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Descripción -->
      <div class="mb-4">
        <label for="description" class="block mb-2 text-sm font-medium form_title_text">Description</label>
        <textarea
          v-model="formData.description"
          id="description"
          class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="Your Description"
        ></textarea>
      </div>

      <!-- Botón de Guardar -->
      <button type="submit" class="w-full submit_button font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Information</button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: "EditarUsuario",
  computed: {
    ...mapState(['userData']) // Accede a userData desde el estado de Vuex
  },
  data() {
    return {
      formData: {
        userName: "",
        email: "",
        gender: "",
        description: ""
      }
    };
  },
  created() {
    if (this.userData) {
      const { userName, email, gender, description } = this.userData;
      this.formData = { userName, email, gender, description };
    }
  },
  methods: {
    async updateUserProfile() {
      try {
        const response = await axios.put(
          `http://localhost:3000/user/${this.formData.userName}`,
          this.formData
        );
        console.log(response);

        alert("Perfil actualizado con éxito");
        this.$router.push(`/user/${this.formData.userName}`);
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert("Hubo un problema al actualizar el perfil.");
      }
    }
  }
};
</script>

<style scoped>
@import '../../style/form.css';
</style>
