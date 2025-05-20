<template>
  <section>
    <br />
    <a class="button button-saas" @click="ExportCompletePaxsModal = true">
      <i class="button is-color4 is-danger button-saas is-radius is-size mr-2"
        ><IconEye class="icon is-small" /> </i
      >Complete Quote
    </a>

    <b-modal v-model="ExportCompletePaxsModal" :width="590">
      <div class="card">
        <div class="card-content pb-0">
          <div class="content">
            <p class="has-text-centered">
              <IconWarning class="icon is-xsmall color-12" />
            </p>
            <p class="is-h2 has-text-centered">
              Please add
              <router-link
                :to="{ path: paths.PAX_INFO.path }"
                class="underline color-4"
                >Paxs info</router-link
              >
              to complete the itinerary.
              <span class="has-text-weight-semibold"></span>
            </p>
          </div>
        </div>
        <footer class="card-footer py-5 is-flex is-justify-content-center">
          <b-button
            type="button"
            @click="ExportCompletePaxsModal = false"
            class="color-7 button is-text px-6 mr-2"
            >No, take me back</b-button
          >
          <router-link
            :to="{ path: paths.PAX_INFO.path }"
            class="button is-info px-6 ml-2 has-text-weight-semibold"
            >Yes, go to pax info</router-link
          >
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import { PATH_INFO } from "@/router/path";

export default {
  name: "ExportCompletePaxsModalsModal",
  data() {
    return {
      ExportCompletePaxsModal: false,
      paths: { ...PATH_INFO },
    };
  },
};
</script>
