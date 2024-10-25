<template>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div v-if="showToast" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span class="sr-only">Error icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ toastMessage }}</div>
      <button type="button" @click="hideToast" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>

    <div class="w-full form_background_input rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight form_title_text md:text-2xl">
          Sign In
        </h1>
        <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
          <!-- USERNAME -->
          <div>
            <label for="nombre" class="block mb-2 text-sm font-medium form_title_text">Nombre</label>
            <input type="text" name="userName" v-model="userName" id="nombre" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Tu Nombre" required="">
          </div>
          <!-- EMAIL -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium form_title_text">Email</label>
            <input type="email" name="email" v-model="email" id="email" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Tu Email" required="">
          </div>
          <!-- PASSWORD -->
          <div class="relative max-w-sm">
            <label for="password" class="block mb-2 text-sm font-medium form_title_text">Contraseña</label>
            <div class="relative">
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                class="form_text_input text-sm rounded-lg block w-full p-2.5 pr-10"
                placeholder="••••••••"
                @input="checkPasswordStrength"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
                required>

              <button
                type="button"
                @click="togglePasswordVisibility('password')"
                class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg v-if="passwordVisible" class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path class="hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle class="hs-password-active:block" cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              </button>
            </div>

            <div id="hs-strong-password-minLength" class="flex mt-2 -mx-1">
              <div
                v-for="n in 5"
                :key="n"
                :class="['h-2 flex-auto rounded-full mx-1', passwordStrengthClass[n - 1]]"
              ></div>
            </div>
          </div>

          <!-- PASSWORD REPEAT -->
          <div class="relative max-w-sm">

            <label for="confirm_password" class="block mb-2 text-sm font-medium form_title_text">Repite Contraseña</label>
            <div class="relative">
              <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              v-model="confirmPassword"
              class="form_text_input text-sm rounded-lg block w-full p-2.5 pr-10"
              placeholder="•••••••••"
              @input="checkPasswordMatch"
              @focus="confirmPasswordFocused = true"
              @blur="confirmPasswordFocused = false"
              required>

              <button
                type="button"
                @click="togglePasswordVisibility('confirm_password')"
                class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg v-if="confirmPasswordVisible" class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path class="hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle class="hs-password-active:block" cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else class="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- PASSWORD CHECK -->
          <div v-if="confirmPassword.length > 0"  class="text-sm mt-2">
            <span v-if="passwordsDoNotMatch" class="text-red-500">✘ Las contraseñas no coinciden</span>
            <span v-else class="text-green-500">✔ Las contraseñas coinciden</span>
          </div>

          <!-- BIRTHDAY -->
          <div>
            <label for="datebirth" class="block mb-2 text-sm font-medium form_title_text">Fecha de Nacimiento</label>
            <div class="relative max-w-sm">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <!-- Ícono de calendario -->
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H3V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1h4V2zM3 9h14v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
                </svg>
              </div>
              <input
                type="text"
                id="birthdate"
                v-model="birthDate"
                name="birthdate"
                datepicker
                datepicker-autohide
                datepicker-format="dd/mm/yyyy"
                :datepicker-max-date="maxDate"
                class="form_text_input pl-10 p-2.5 text-sm rounded-lg block w-full datepicker_custom"
                placeholder="Selecciona una fecha"
                required
              />

            </div>
          </div>
          <!-- GENRE -->
          <div>
            <label for="gender" class="block mb-2 text-sm font-medium form_title_text">Género</label>
            <select id="gender" name="gender" v-model="gender" class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
              <option value="" disabled selected>Seleccione su género</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <!-- CREATION ACCOUNT -->
          <button type="submit" class="w-full submit_button font-medium rounded-lg text-sm px-5 py-2.5 text-center">Crear cuenta</button>
        </form>

        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          ¿Ya tienes una cuenta?
          <a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login aquí</a>
        </p>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'RegisterView',
  data() {
    return {
      maxDate: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      gender: '',
      passwordVisible: false,
      confirmPasswordVisible: false,
      passwordFocused: false,
      confirmPasswordFocused: false,
      passwordStrengthClass: '',
      passwordsDoNotMatch: true,
      passwordStrength: 0,
      showToast: false,
      toastMessage: ''
    };
  },
  mounted() {
    const today = new Date();
    const sixteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 16));

    this.maxDate = `${String(sixteenYearsAgo.getDate()).padStart(2, '0')}-${String(sixteenYearsAgo.getMonth() + 1).padStart(2, '0')}-${sixteenYearsAgo.getFullYear()}`;
  },
  methods: {
    hideToast() {
      this.showToast = false;
    },
    togglePasswordVisibility(field) {
      const input = document.getElementById(field);
      if (input.type === 'password') {
        input.type = 'text';
        if (field === 'password') this.passwordVisible = true;
        else this.confirmPasswordVisible = true;
      } else {
        input.type = 'password';
        if (field === 'password') this.passwordVisible = false;
        else this.confirmPasswordVisible = false;
      }
    },
    showToastWithMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 5000);
    },
    checkPasswordStrength() {
      if (!this.password) {
        this.passwordStrengthClass = [];
        return;
      }

      const hasNumbers = /\d/.test(this.password);
      const hasLowercase = /[a-z]/.test(this.password);
      const hasUppercase = /[A-Z]/.test(this.password);
      const hasSpecialChars = /[\W_]/.test(this.password);
      const lengthSufficient = this.password.length >= 6;

      this.passwordStrength = 0;

      if (lengthSufficient) this.passwordStrength++;
      if (hasNumbers) this.passwordStrength++;
      if (hasLowercase) this.passwordStrength++;
      if (hasUppercase) this.passwordStrength++;
      if (hasSpecialChars) this.passwordStrength++;

      switch (this.passwordStrength) {
        case 1:
          this.passwordStrengthClass = ['bg-red-500', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
          break;
        case 2:
          this.passwordStrengthClass = ['bg-yellow-500', 'bg-yellow-500', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
          break;
        case 3:
          this.passwordStrengthClass = ['bg-orange-500', 'bg-orange-500', 'bg-orange-500', 'bg-gray-200', 'bg-gray-200'];
          break;
        case 4:
          this.passwordStrengthClass = ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-gray-200'];
          break;
        case 5:
          this.passwordStrengthClass = ['bg-teal-500', 'bg-teal-500', 'bg-teal-500', 'bg-teal-500', 'bg-teal-500'];
          break;
        default:
          this.passwordStrengthClass = ['bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
          break;
      }

      this.checkPasswordMatch();
    },
    checkPasswordMatch() {
      if (this.password && this.confirmPassword) {
        this.passwordsDoNotMatch = this.password !== this.confirmPassword;
      } else {
        this.passwordsDoNotMatch = true;
      }
    },
    async handleSubmit() {
      if (this.password !== this.confirmPassword) {
        this.showToastWithMessage('Las contraseñas no coinciden.');
        return;
      }

      if(this.passwordStrength !== 5){
        this.showToastWithMessage('La contraseña no es suficientemente segura.');
        return;
      }

      const data = {
        userName: this.userName,
        password: this.password,
        birthDate: this.birthDate,
        email: this.email,
        gender: this.gender,
      };

      console.log(data)
      try {
        const response = await fetch('https://ejemplo.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Éxito:', result);
        } else {
          console.error('Error al enviar el formulario:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  },
}
</script>


<style scoped>
@import '../style/form.css';
</style>
