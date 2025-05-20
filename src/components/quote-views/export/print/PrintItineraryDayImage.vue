<template>
  <tr>
    <td
      class="mcnImageBlockInner"
      :style="{ padding: '0px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        align="left"
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="mcnImageContentContainer"
        :style="{
          'min-width': '100%',
          'border-collapse': 'collapse',
          'text-size-adjust': '100%',
        }"
        width="100%"
      >
        <tbody>
          <tr>
            <td
              class="mcnImageContent"
              :style="{
                padding: '0px',
                'text-align': 'center',
                'text-size-adjust': '100%',
              }"
              valign="top"
            >
              <img
                align="center"
                alt=""
                class="mcnImage"
                :src="
                  'images_full' in day &&
                  day.images_full &&
                  day.images_full.length
                    ? day.images_full[0].thumbnail_350X240.replaceAll(
                        ' ',
                        '%20'
                      )
                    : 'https://place-hold.it/700x300/DDDDDD/fff.jpg?bold&fontsize=70&text=Day ' +
                      day.start_day
                "
                :style="{
                  'padding-bottom': '0px',
                  display: 'inline !important',
                  'vertical-align': 'bottom',
                  border: '0px',
                  height: '300px',
                  outline: 'none',
                  'text-decoration': 'none',
                  'max-height': '300px',
                  'object-fit': 'cover',
                }"
                width="400"
                height="240"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
export default {
  name: "PrintItineraryDayImage",
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
