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
                color: 'rgb(0, 0, 0)',
                'font-family':
                  'Open Sans, Helvetica Neue, Helvetica, Arial,sans-serif',
                'font-size': '34px',
                'line-height': '100%',
                'text-size-adjust': '100%',
                'word-break': 'break-word',
                'text-align': 'left',
              }"
              valign="top"
            >
              <div :style="{ 'text-align': 'center' }">
                <br />
                <strong
                  ><span
                    :style="{ 'font-size': '32px', color: 'rgb(77, 77, 77)' }"
                  ></span
                  >{{ title }}</strong
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
  name: "PrintSectionTitle",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
