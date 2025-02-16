<template>
  <div class="result-container">
    <h1>🎯 Quiz Completed!</h1>
    <p class="score-text">
      Your Score: <span class="highlight">{{ score }}</span> /
      <span class="highlight">{{ total }}</span>
    </p>
    <p v-if="score >= passingScore" class="success-msg">
      🎉 Congratulations! You Passed!
    </p>
    <p v-else class="fail-msg">❌ Better luck next time!</p>
    <button class="retry-btn" @click="restartQuiz">Try Again</button>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import confetti from "canvas-confetti";
import "./styles.css";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const score = route.query.score ? parseInt(route.query.score) : 0;
    const total = route.query.total ? parseInt(route.query.total) : 0;
    const passingScore = Math.ceil(total * 0.7);

    if (score >= passingScore) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        });
      }, 500);
    }

    function restartQuiz() {
      router.push("/");
    }

    return { score, total, passingScore, restartQuiz };
  },
};
</script>
