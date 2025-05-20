export function testId(vueInstance) {
  // Setting data attribute with a specific name
  vueInstance.directive("tid", {
    // eslint-disable-next-line
    inserted: function (el, binding, vnode) {
      el.setAttribute("data-tid", binding.arg);
    },
  });
}
