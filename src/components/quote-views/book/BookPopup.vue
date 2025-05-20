<template>
  <section>
    <br />
    <a class="button is-color1" @click="BookPopupStatus = true">
      <i class="mr-4"><IconCheck class="icon is-small" /> </i>Book Itinerary
    </a>

    <b-modal v-model="BookPopupStatus" :width="590">
      <div class="card">
        <div class="card-content pb-0">
          <div class="content">
            <p class="has-text-centered">
              <IconCheck class="icon iconBookPopup" />
            </p>
            <p class="is-h2 has-text-centered">
              Now your itinerary is <strong>Booked</strong>.
              <span class="has-text-weight-semibold"></span>
            </p>
          </div>
        </div>
        <footer class="card-footer py-5 is-flex is-justify-content-center">
          <b-button
            type="button"
            class="button is-info px-6 mb-4 ml-2 has-text-weight-semibold"
            @click="BookPopupStatus = false"
            >Ok, thanks!</b-button
          >
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: "BookPopupStatussModal",
  data() {
    return {
      BookPopupStatus: false,
    };
  },
};
</script>
