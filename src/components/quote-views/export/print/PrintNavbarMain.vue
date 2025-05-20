<template>
  <tr>
    <td
      class="mcnImageBlockInner"
      :style="{ padding: '9px', 'text-size-adjust': '100%' }"
      valign="top"
    >
      <table
        align="center"
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
                padding: '0px 9px',
                'text-align': 'center',
                'text-size-adjust': '100%',
              }"
              valign="top"
            >
              <img
                align="center"
                alt="Encounter Latin America"
                class="navbarMainLogo"
                :src="logoImage"
                :style="{
                  display: 'flex',
                  margin: 'auto',
                  'object-fit': 'cover',
                }"
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
import { exportHelper } from "@/utils/export";
import { EXPORT_IMAGES_TYPES } from "@/constants/exportConfig";

export default {
  name: "PrintNavbarMain",
  computed: {
    ...mapGetters({
      publishedItinerary: "itinerary/getPublishedConfigAndImages",
    }),
    logoImage() {
      return (
        this.publishedItinerary?.images?.find(
          (image) => image.type === EXPORT_IMAGES_TYPES.LOGO
        )?.images_full?.[0]?.thumbnail_350X240 || ""
      );
    },
  },
  watch: {
    publishedItinerary: {
      handler() {
        this.adjustsLogoImageResolution();
      },
      immediate: true,
    },
  },
  methods: {
    async adjustsLogoImageResolution() {
      const logoImage = this.publishedItinerary?.images?.find(
        (image) => image.type === EXPORT_IMAGES_TYPES.LOGO
      )?.images_full?.[0]?.thumbnail_350X240;
      exportHelper.getImageResolutionFromBase64(logoImage).then((res) => {
        document
          .querySelector(".navbarMainLogo")
          .setAttribute("width", res.width * 0.5);
        document
          .querySelector(".navbarMainLogo")
          .setAttribute("height", res.height * 0.5);
      });
    },
  },
};
</script>
