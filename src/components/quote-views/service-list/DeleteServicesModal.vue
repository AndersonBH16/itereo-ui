<template>
  <section>
    <a href="#" @click="DeleteService = true"
      ><IconTrash class="icon color-8 is-xsmall"
    /></a>
    <b-modal v-model="DeleteService" :width="590">
      <div class="card">
        <div class="card-content pb-0">
          <div class="content">
            <p class="has-text-centered">
              <IconWarning class="icon is-xsmall color-12" />
            </p>
            <p class="is-h2 has-text-centered">
              Are you sure to
              <span class="has-text-weight-semibold">delete</span> this service?
            </p>
          </div>
        </div>
        <footer class="card-footer py-5 is-flex is-justify-content-center">
          <b-button
            type="button"
            @click="DeleteService = false"
            class="color-7 button is-text px-6 mr-2"
            >No, take me back</b-button
          >
          <b-button
            type="button"
            class="button is-info px-6 ml-2 has-text-weight-semibold"
            >Yes, delete it</b-button
          >
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: "DeleteServicesModal",
  data() {
    return {
      DeleteService: false,
    };
  },
};
</script>
