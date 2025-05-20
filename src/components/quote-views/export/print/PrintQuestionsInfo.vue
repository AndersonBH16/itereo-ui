<template>
  <tr>
    <td
      class="mcnCaptionBlockInner"
      :style="{ padding: '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="mcnCaptionLeftContentOuter"
        :style="{ 'border-collapse': 'collapse', 'text-size-adjust': '100%' }"
        width="100%"
      >
        <tbody>
          <tr>
            <td
              class="mcnCaptionLeftContentInner"
              :style="{ padding: '0px 9px', 'text-size-adjust': '100%' }"
              valign="top"
            >
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                :style="{
                  'border-collapse': 'collapse',
                  'text-size-adjust': '100%',
                }"
              >
                <tbody>
                  <tr>
                    <td
                      :style="{
                        'text-size-adjust': '100%',
                        'word-break': 'break-word',
                        color: 'rgb(150, 150, 150)',
                        'font-family': 'Verdana, Geneva, sans-serif',
                        'font-size': '14px',
                        'line-height': '200%',
                        'text-align': 'left',
                      }"
                      valign="top"
                    >
                      <table
                        :style="{
                          background: 'white',
                          padding: '0px',
                          color: 'rgb(86, 88, 89)',
                          'font-size': '14px',
                          'font-family': 'Arial, Geneva, sans-serif',
                          'border-spacing': '0px',
                          'border-collapse': 'collapse',
                          'text-size-adjust': '100%',
                        }"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              :style="{
                                margin: 'auto',
                                'text-align': 'center',
                              }"
                              valign="middle"
                            >
                              <p :style="{ 'font-size': '20px' }">
                                {{ itinerary.user ? itinerary.user.name : "" }}
                              </p>
                              <a
                                href="mailto:agent@encounterlatinamerica.com"
                                :style="{
                                  'font-weight': '700',
                                  'font-family': 'Arial, Geneva, sans-serif',
                                  'text-decoration': 'none',
                                  'text-size-adjust': '100%',
                                  color: 'rgb(4, 118, 201)',
                                }"
                                target="_blank"
                                ><font
                                  color="#666666"
                                  face="Arial"
                                  :style="{
                                    'font-size': '12px',
                                    'text-decoration': 'none',
                                  }"
                                  ><strong
                                    :style="{
                                      color: 'rgb(102, 102, 102)',
                                      'font-weight': 'normal',
                                    }"
                                    >{{
                                      itinerary.user ? itinerary.user.email : ""
                                    }}</strong
                                  ></font
                                ></a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
export default {
  name: "PrintQuestionsInfo",
  props: {
    itinerary: {
      type: [Array, Object],
      default: () => [],
    },
  },
};
</script>
