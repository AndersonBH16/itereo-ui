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
                :src="backgroundImage"
                :style="{
                  'object-fit': 'cover',
                  'padding-bottom': '0px',
                  display: 'inline !important',
                  'vertical-align': 'bottom',
                  border: '0px',
                  outline: 'none',
                  'text-decoration': 'none',
                  'max-height': '350px',
                  'max-width': '700px',
                  height: '350px',
                  width: '700px',
                }"
                width="500"
                height="300"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
import { EXPORT_IMAGES_TYPES } from "@/constants/exportConfig";

export default {
  name: "PrintHeroImage",
  computed: {
    ...mapGetters({
      publishedItinerary: "itinerary/getPublishedConfigAndImages",
    }),
    backgroundImage() {
      return (
        this.publishedItinerary?.images?.find(
          (image) => image.type === EXPORT_IMAGES_TYPES.BACKGROUND
        )?.images_full?.[0]?.thumbnail_1200X725 || ""
      );
    },
  },
};
</script>
