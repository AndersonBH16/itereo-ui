<template>
  <div class="container__search_input">
    <div class="input_search" style="width: 88%">
      <IconFilter class="icon is-small" />
      <input
        type="text"
        class="input"
        placeholder="Type itinerary code or title"
        @input="$emit('update', $event.target.value)"
        ref="searchInput"
      />
    </div>
    <button class="button_search ml-4" @click="onButtonClick">
      <IconSearch slot="icon" class="icon is-small" style="width: 1.2rem" />
    </button>
  </div>
</template>
<script>
export default {
  name: "BaseFilterSearchInput",
  props: {
    onButtonClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
<style scoped>
.container__search_input {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f00b81;
}
.input_search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
}
.input_search .input {
  outline: none;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  width: 18rem;
}
.button_search {
  background: #f00b81;
  border: none;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}
.button_search :is(svg) {
  color: #fff;
}
</style>
