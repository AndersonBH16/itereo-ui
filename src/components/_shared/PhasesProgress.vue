<template>
  <div :class="`progress__container ${reducedView ? 'reduced' : ''}`">
    <div
      v-for="(step, index) in stepsWithIntermediates"
      :key="index"
      class="step"
      :class="{
        active: step.active,
        completed: step.completed,
        intermediate: step.intermediate,
      }"
    >
      <div v-if="!step.intermediate" style="display: grid; place-items: center">
        <div class="step__icon__container">
          <IconCheck v-if="step.completed" />
          <span v-else></span>
        </div>
        {{ !reducedView ? `Step ${step.trulyIndex}` : "" }}
        <p>
          {{ step.label }}
        </p>
        <span v-if="!reducedView" class="step__status">
          {{ step.completed ? "Completed" : "Pending" }}
        </span>
      </div>
      <div class="step__link" v-if="step.intermediate">
        <div
          v-if="stepsWithIntermediates[index - 1].active"
          :style="`width: ${
            stepsWithIntermediates[index - 1].completed ? '100%' : '50%'
          }`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhasesProgress",
  props: {
    steps: {
      type: Array,
      required: true,
      default: () => [],
    },
    reducedView: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    stepsWithIntermediates() {
      return this.steps.reduce((acc, step, index) => {
        const isFirstElement = index === 0;
        if (!isFirstElement)
          acc.push({ ...step, intermediate: !isFirstElement });
        acc.push({
          ...step,
          trulyIndex: acc.filter((s) => !s.intermediate).length + 1,
        });
        return acc;
      }, []);
    },
  },
};
</script>

<style>
.progress__container {
  display: flex;
  justify-content: space-between;
}

.progress__container.reduced {
  padding: 0rem;
  box-shadow: none;
}

.progress__container.reduced .step__icon__container {
  width: 2rem;
  height: 2rem;
}

.progress__container.reduced .step > div > p {
  font-size: 0.8rem;
}

.progress__container > h2 {
  text-align: left;
  font-size: 1.5rem;
  font-weight: 700;
}

.step {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  display: grid;
  place-items: center;
}

.step.intermediate .step__link {
  display: block;
  width: 150%;
  height: 0.25rem;
  background-color: #ccc;
  position: relative;
  top: -3rem;
  border-radius: 0.2rem;
}

.step.intermediate .step__link > div {
  display: block;
  width: 50%;
  height: 0.25rem;
  background-color: #f00b81;
  border-radius: 0.2rem;
}

.progress__container.reduced .step.intermediate .step__link {
  width: 5rem;
  top: -1rem;
}

.step > div > p {
  padding: 0.25rem 0 0.5rem;
  font-weight: 700;
  color: #aaa;
  font-size: 1rem;
}

.step:is(.active, .completed) > div > p {
  color: #444;
}

.step__icon__container {
  margin-bottom: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid #ccc;
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  position: relative;
}

.progress__container.reduced
  .step:not(:last-child)
  .step__icon__container::before {
  width: 2.5rem;
  left: 120%;
}

.progress__container.reduced
  .step:not(:last-child)
  .step__icon__container::after {
  width: 1.25rem;
  left: 120%;
}

.step__icon__container > span {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #ccc;
}

.step:is(.active, .completed) .step__icon__container {
  background-color: #f00b81;
  border: none;
}

.step:is(.active, .completed) .step__icon__container > span {
  background-color: #fff;
}

.step:is(.completed) > p {
  color: #444444;
}

.step:is(.active, .completed) svg {
  color: #fff;
}

.step__status {
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #ccc;
  color: #fff;
}

.step:is(.active, .completed) .step__status {
  background-color: #f00b81;
}

@media screen and (max-width: 480px) {
  .progress__container {
    flex-direction: column;
  }

  .step.intermediate .step__link {
    top: 0rem;
    width: 2rem;
  }
}
</style>
