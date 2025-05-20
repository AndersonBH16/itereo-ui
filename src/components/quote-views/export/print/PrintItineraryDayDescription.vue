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
          'font-family': 'Verdana, Geneva, sans-serif',
          'font-size': '14px',
        }"
        width="100%"
      >
        <tbody>
          <tr>
            <td v-html="day.description.value"></td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
export default {
  name: "PrintItineraryDayDescription",
  props: {
    day: {
      type: Object,
      default: () => {},
    },
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
  methods: {
    format(date) {
      let formatted = "";
      if (date) {
        const d = new Date(date + " 00:00:00");
        const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
        const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
        formatted = `${da}-${mo}-${ye}`;
      }
      return formatted;
    },
  },
};
</script>
