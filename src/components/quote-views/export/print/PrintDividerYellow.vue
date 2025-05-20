<template>
  <tr>
    <td :style="{ 'text-size-adjust': '100%' }" valign="top">
      <div align="center">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          :style="{
            'text-align': 'center',
            'min-width': '19%',
            'padding-bottom': '18px',
            margin: 'auto',
            'border-collapse': 'collapse',
            'text-size-adjust': '100%',
            'table-layout': 'fixed !important',
          }"
          width="19%"
        >
          <tbody align="center">
            <tr>
              <td
                :style="{
                  'min-width': '100%',
                  padding: '0px 18px 9px',
                  'text-size-adjust': '100%',
                }"
              >
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  :style="{
                    'min-width': '100%',
                    'border-top': '2px solid rgb(253, 169, 0)',
                    'border-collapse': 'collapse',
                    'text-size-adjust': '100%',
                  }"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td :style="{ 'text-size-adjust': '100%' }">
                        <span>&nbsp;</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>
<script>
export default {
  name: "PrintDividerYellow",
};
</script>
