<template>
  <section>
    <a @click="open = true" class="is-pulled-right button is-color1">
      <i class="color1 is-radius is-size mr-2 v-middle">
        <IconBasket class="icon is-small" /> </i
      ><strong>Added (2)</strong>
    </a>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="open"
      class="sidebarRight"
    >
      <div class="topCloseSideBar is-flex pr-5 p-2">
        <a @click="open = false" class="is-flex color-8">
          <IconChevronLeft class="icon is-small mr-2" />
          <span class="color-4 has-text-weight-medium">Services added (2)</span>
        </a>
        <a @click="open = false" class="color-8 sideBarCloseButton">
          <IconClose class="icon is-small" />
        </a>
      </div>
      <div class="p-5 SideBarBox">
        <div class="mt-3">
          <div class="card">
            <div class="card-content p-3 py-4">
              <div class="media">
                <div class="media-content">
                  <p>
                    <span class="subtitle is-7 mr-3">03 Mar &gt; 04 Mar</span>
                    <span class="subtitle is-7 mr-3"> 02 paxs</span>
                  </p>
                  <p>
                    <span class="title is-6 has-text-weight-bold mr-3"
                      >Hotel Name go here</span
                    >
                    <span class="subtitle is-7 color-7">LIMAC009</span>
                  </p>
                  <p>
                    <span class="subtitle is-7 mr-3">Sales Price $280</span>
                  </p>
                </div>
                <div class="media-right ml-2 has-text-right">
                  <div class="mb-4">
                    <a href="#"><IconTrash class="icon color-8 is-xsmall" /></a>
                  </div>
                  <div>
                    <a class="button button-saas">
                      <i
                        class="button is-color4 is-danger button-saas is-radius is-size is-small mr-2"
                      >
                        <IconPencil class="icon is-small" /></i
                      >Edit
                    </a>
                  </div>
                </div>
              </div>
              <div class="media">
                <div class="media-content">
                  <p>
                    <span class="subtitle is-7 mr-3">03 Mar &gt; 04 Mar</span>
                    <span class="subtitle is-7 mr-3"> 02 paxs</span>
                  </p>
                  <p>
                    <span class="title is-6 has-text-weight-bold mr-3"
                      >Hotel Name go here</span
                    >
                    <span class="subtitle is-7 color-7">LIMAC009</span>
                  </p>
                  <p>
                    <span class="subtitle is-7 mr-3">Sales Price $280</span>
                  </p>
                </div>
                <div class="media-right ml-2 has-text-right">
                  <div class="mb-4">
                    <a href="#"><IconTrash class="icon color-8 is-xsmall" /></a>
                  </div>
                  <div>
                    <a class="button button-saas">
                      <i
                        class="button is-color4 is-danger button-saas is-radius is-size is-small mr-2"
                      >
                        <IconPencil class="icon is-small" /></i
                      >Edit
                    </a>
                  </div>
                </div>
              </div>
              <div class="media">
                <div class="media-content">
                  <p>
                    <span class="subtitle is-7 mr-3">03 Mar &gt; 04 Mar</span>
                    <span class="subtitle is-7 mr-3"> 02 paxs</span>
                  </p>
                  <p>
                    <span class="title is-6 has-text-weight-bold mr-3"
                      >Hotel Name go here</span
                    >
                    <span class="subtitle is-7 color-7">LIMAC009</span>
                  </p>
                  <p>
                    <span class="subtitle is-7 mr-3">Sales Price $280</span>
                  </p>
                </div>
                <div class="media-right ml-2 has-text-right">
                  <div class="mb-4">
                    <a href="#"><IconTrash class="icon color-8 is-xsmall" /></a>
                  </div>
                  <div>
                    <a class="button button-saas">
                      <i
                        class="button is-color4 is-danger button-saas is-radius is-size is-small mr-2"
                      >
                        <IconPencil class="icon is-small" /></i
                      >Edit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
export default {
  name: "AddServicesModalResultsBasket",
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
    };
  },
};
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
