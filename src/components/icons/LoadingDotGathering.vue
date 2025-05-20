<template>
  <div class="snippet" data-title="dot-gathering">
    <div class="stage filter-contrast">
      <div class="dot-gathering"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoadingDotGathering",
};
</script>
<style scoped>
.dot-gathering {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: black;
  color: transparent;
  margin: -1px 0;
  filter: blur(1px);
  transform: scale(1.2);
}

.dot-gathering::before,
.dot-gathering::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: -50px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: black;
  color: transparent;
  opacity: 0;
  filter: blur(1px);
  animation: dotGathering 2s infinite ease-in;
}

.dot-gathering::after {
  animation-delay: 0.5s;
}

@keyframes dotGathering {
  0% {
    opacity: 0;
    transform: translateX(0);
  }
  35%,
  60% {
    opacity: 1;
    transform: translateX(50px);
  }
  100% {
    opacity: 0;
    transform: translateX(100px);
  }
}
</style>
