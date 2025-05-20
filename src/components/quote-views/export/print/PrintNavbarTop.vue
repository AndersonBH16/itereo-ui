<template>
  <tr>
    <td
      :style="{
        padding: '0px 0px 9px',
        'text-align': 'center',
        'text-size-adjust': '100%',
        'word-break': 'break-word',
        color: 'rgb(209, 23, 98)',
        'font-family': 'Verdana, Geneva, sans-serif',
        'font-size': '12px',
        'line-height': '150%',
      }"
      valign="top"
    >
      <table align="center">
        <tbody>
          <tr>
            <td :style="{ width: '50%' }">
              <div>
                <a
                  href="tel:1-512-298-5285"
                  :style="{
                    'text-decoration': 'none',
                    'text-size-adjust': '100%',
                    color: 'rgb(209, 23, 98) !important',
                    cursor: 'default',
                    'font-weight': 'normal',
                  }"
                >
                  US: +1 512-298-5285</a
                ><span>|</span
                ><a
                  href="tel:44-203-239-0003"
                  :style="{
                    'text-decoration': 'none',
                    'text-size-adjust': '100%',
                    color: 'rgb(209, 23, 98) !important',
                    cursor: 'default',
                    'font-weight': 'normal',
                  }"
                  >UK: +44 203 239-0003</a
                >
              </div>
            </td>
            <td :style="{ width: '50%' }">
              <div :style="{ 'text-align': 'right' }">
                <a
                  href="mailto:experience@encounterlatinamerica.com"
                  :style="{
                    'text-decoration': 'none',
                    'text-size-adjust': '100%',
                    color: 'rgb(209, 23, 98) !important',
                    'font-weight': 'normal',
                  }"
                >
                  experience@encounterlatinamerica.com</a
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>
<script>
export default {
  name: "PrintNavbarTop",
  props: {
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
};
</script>
