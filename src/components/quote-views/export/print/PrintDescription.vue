<template>
  <tr>
    <td
      :style="{ 'padding-top': '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        align="left"
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="mcnTextContentContainer"
        :style="{
          'max-width': '100%',
          'min-width': '100%',
          'border-collapse': 'collapse',
          'text-size-adjust': '100%',
        }"
        width="100%"
      >
        <tbody>
          <tr>
            <td
              :style="{
                padding: '0px 18px 9px',
                'text-size-adjust': '100%',
                'word-break': 'break-word',
                'font-family': 'Verdana, Geneva, sans-serif',
                'font-size': '14px',
                'line-height': '200%',
                'text-align': 'left',
                color: 'rgb(77, 77, 77)',
              }"
              valign="top"
            >
              <div
                class="itinerary-description"
                v-html="
                  itinerary && 'description' in itinerary
                    ? itinerary.description.value
                    : ''
                "
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
export default {
  name: "PrintDescription",
  props: {
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
};
</script>
<style scoped>
.itinerary-description {
  max-width: 75vw;
}
</style>
