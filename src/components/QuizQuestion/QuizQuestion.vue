<template>
  <div class="quiz-container">
    <div class="quiz-box">
      <div class="quiz-header">
        <div class="goal">Goal: {{ goal }}</div>
        <div class="current-score">Current score: {{ currentScore }}</div>
      </div>

      <h2 class="question-text">Question {{ index + 1 }}</h2>
      <h2 class="question-text">{{ question.text }}</h2>

      <div v-if="question.type === 'multiple-choice'" class="options-container">
        <button
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
          @click="selectAnswer(option)"
          :class="{
            correct: selected === option && isCorrect,
            wrong: selected === option && !isCorrect,
            'correct-answer': selected && option === question.answer,
          }"
          class="option-btn"
          :disabled="selected"
        >
          <span class="option-label">
            {{ String.fromCharCode(65 + optionIndex) }}.
          </span>
          {{ option }}
          <span v-if="selected === option" class="icon">
            {{ isCorrect ? "✔" : "✖" }}
          </span>
        </button>
      </div>

      <div v-if="question.type === 'drag-drop'" class="drag-drop-container">
        <div class="draggable-options">
          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            draggable="true"
            @dragstart="dragStart(option, $event)"
            @touchstart="touchStart(option, $event)"
            @touchmove="touchMove($event)"
            @touchend="dropTouch"
            class="draggable-item"
          >
            {{ option }}
          </div>
        </div>

        <div
          class="drop-zone"
          @drop="dropAnswer"
          @dragover.prevent
          @touchend="dropTouch"
          @touchmove.prevent="touchMove"
        >
          <p v-if="userAnswers.length === 0">Drop answers here</p>
          <div
            v-for="(answer, ansIndex) in userAnswers"
            :key="ansIndex"
            class="dropped-item"
          >
            {{ answer }}
          </div>
        </div>
      </div>

      <p
        v-if="
          selected ||
          (question.type === 'drag-drop' &&
            userAnswers.length === question.answer.length)
        "
        class="explanation"
        :class="{ 'correct-exp': isCorrect, 'wrong-exp': !isCorrect }"
      >
        {{ explanation }}
      </p>

      <p class="question-progress">
        {{ index + 1 }} of {{ questions.length }} Questions
      </p>

      <button
        v-if="
          selected ||
          (question.type === 'drag-drop' &&
            userAnswers.length === question.answer.length)
        "
        @click="nextQuestion"
        class="next-btn"
      >
        Next Question
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import "./styles.css";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    const questions = ref([
      {
        text: "What is the chemical symbol for water?",
        type: "multiple-choice",
        options: ["H2O", "O2", "CO2", "H2"],
        answer: "H2O",
        explanation: "Water is made of two hydrogen atoms and one oxygen atom.",
      },
      {
        text: "Which planet is known as the Red Planet?",
        type: "multiple-choice",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
        explanation:
          "Mars appears red due to iron oxide (rust) on its surface.",
      },
      {
        text: "What is the powerhouse of the cell?",
        type: "multiple-choice",
        options: [
          "Nucleus",
          "Mitochondria",
          "Ribosome",
          "Endoplasmic reticulum",
        ],
        answer: "Mitochondria",
        explanation: "Mitochondria produce energy for the cell.",
      },
      {
        text: "Arrange the steps of the water cycle in order:",
        type: "drag-drop",
        options: ["Evaporation", "Condensation", "Precipitation", "Collection"],
        answer: ["Evaporation", "Condensation", "Precipitation", "Collection"],
        explanation:
          "Water evaporates, forms clouds, falls as rain, and collects.",
      },
      {
        text: "Arrange the planets in order from the Sun:",
        type: "drag-drop",
        options: ["Venus", "Earth", "Mars", "Mercury"],
        answer: ["Mercury", "Venus", "Earth", "Mars"],
        explanation: "The order is Mercury, Venus, Earth, and Mars.",
      },
    ]);

    questions.value = shuffleArray(
      questions.value.map((q) => ({
        ...q,
        options:
          q.type === "multiple-choice" ? shuffleArray(q.options) : q.options,
      }))
    );

    const index = ref(0);
    const selected = ref(null);
    const isCorrect = ref(false);
    const currentScore = ref(0);
    const goal = ref(5);
    const explanation = ref("");
    const draggedOption = ref(null);
    const userAnswers = ref([]);
    const question = ref(questions.value[index.value]);

    function selectAnswer(option) {
      selected.value = option;
      isCorrect.value = option === question.value.answer;

      if (isCorrect.value) {
        currentScore.value++;
        explanation.value =
          "✅ Correct! Well done. " + question.value.explanation;
      } else {
        explanation.value = `❌ Incorrect. The correct answer is "${question.value.answer}". ${question.value.explanation}`;
      }
    }

    function dragStart(option, event) {
      draggedOption.value = option;
      if (event.dataTransfer) {
        event.dataTransfer.setData("text", option);
      }
    }

    function touchStart(option, event) {
      draggedOption.value = option;
      const touch = event.touches[0];
      event.target.style.position = "absolute";
      event.target.style.left = `${touch.clientX}px`;
      event.target.style.top = `${touch.clientY}px`;
    }
    function touchMove(event) {
      const touch = event.touches[0];
      event.target.style.left = `${touch.clientX}px`;
      event.target.style.top = `${touch.clientY}px`;
    }

    function dropAnswer(event) {
      let droppedOption =
        event.dataTransfer?.getData("text") || draggedOption.value;
      if (droppedOption && !userAnswers.value.includes(droppedOption)) {
        userAnswers.value.push(droppedOption);
      }
      if (userAnswers.value.length === question.value.answer.length) {
        checkDragDropAnswer();
      }
    }
    function dropTouch(event) {
      if (
        draggedOption.value &&
        !userAnswers.value.includes(draggedOption.value)
      ) {
        userAnswers.value.push(draggedOption.value);
      }

      event.target.style.position = "static";
      event.target.style.left = "auto";
      event.target.style.top = "auto";

      if (userAnswers.value.length === question.value.answer.length) {
        checkDragDropAnswer();
      }
    }
    function checkDragDropAnswer() {
      isCorrect.value =
        JSON.stringify(userAnswers.value) ===
        JSON.stringify(question.value.answer);
      explanation.value = isCorrect.value
        ? `✅ Correct! ${question.value.explanation}`
        : `❌ Incorrect. The correct order is: ${question.value.answer.join(
            " → "
          )}. ${question.value.explanation}`;

      if (isCorrect.value) currentScore.value++;
    }

    function nextQuestion() {
      if (index.value < questions.value.length - 1) {
        index.value++;
        question.value = questions.value[index.value];
        selected.value = null;
        explanation.value = "";
        userAnswers.value = [];
        draggedOption.value = null;
      } else {
        router.push({
          path: "/results",
          query: { score: currentScore.value, total: questions.value.length },
        });
      }
    }

    return {
      question,
      selected,
      selectAnswer,
      nextQuestion,
      isCorrect,
      index,
      questions,
      currentScore,
      goal,
      explanation,
      dragStart,
      touchStart,
      dropAnswer,
      dropTouch,
      userAnswers,
    };
  },
};
</script>
