<template>
  <div :class="['home', darkMode ? 'dark' : '']">
    <div class="overlay">
      <h1 ref="titleRef" class="title"></h1>
      <p class="subtitle fade-in">Test your knowledge and have fun!</p>
      <button @click="startQuiz" class="start-btn fade-in">Start Quiz</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import "./styles.css";
export default {
  setup() {
    const titleRef = ref(null);
    const darkMode = ref(false);
    const titleText = "Welcome to the Quiz";

    onMounted(() => {
      typeEffect(titleText, titleRef.value, 0);
    });

    const typeEffect = (text, element, index) => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => typeEffect(text, element, index + 1), 80);
      }
    };

    const startQuiz = () => {
      window.location.href = "/quiz";
    };

    return { titleRef, darkMode, startQuiz };
  },
};
</script>

< 