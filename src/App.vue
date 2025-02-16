<template>
  <div :class="['app', darkMode ? 'dark' : '']">
    <!-- Global Header -->
       <!-- Header Section -->
    <header class="header">
      <h1 class="logo">Kedev<span class="logo-accent">Quiz</span></h1>
      <!-- <button @click="toggleDarkMode" class="dark-mode-toggle">
        <i class="vue-icon" v-if="darkMode"></i>
        <i class="vue-icon dark" v-else></i>
      </button> -->
    </header>

    <!-- Page Content -->
    <router-view />
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";

export default {
  setup() {
    const darkMode = ref(localStorage.getItem("darkMode") === "true");

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      document.body.classList.toggle("dark-mode", darkMode.value);
      localStorage.setItem("darkMode", darkMode.value);
    };

    // Ensure dark mode persists across routes
    watchEffect(() => {
      document.body.classList.toggle("dark-mode", darkMode.value);
    });

    return { darkMode, toggleDarkMode };
  },
};
</script>

<style>
/* Global Dark Mode */
.app {
  transition: background 0.3s ease-in-out;
}

.app.dark {
  background: #121212;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  padding: 1px 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.app.dark .header {
  background: rgba(0, 0, 0, 0.7);
}
.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  transition: color 0.3s;
}

.logo-accent {
  color: #6a11cb;
}

.home.dark .logo {
  color: #fff;
}

.home.dark .logo-accent {
  color: #a970ff;
}

/* Ensure page content starts below the header */
router-view {
  margin-top: 80px;
}
</style>