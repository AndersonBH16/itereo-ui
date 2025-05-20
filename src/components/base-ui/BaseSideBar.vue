<template>
  <section>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="open"
    >
      <div class="topCloseSideBar is-flex pr-5 p-2">
        <div class="is-flex">
          <IconChevronLeft class="icon is-small mr-2" /><span
            class="color-4 has-text-weight-medium"
            >New Quote</span
          >
        </div>
        <IconClose class="icon is-small" />
      </div>
      <div class="p-5 SideBarBox">
        <p>Congratulations! Select one of the options to start creating it.</p>
        <div class="newQuoteSidebar mt-6 p-3">
          <div class="columns">
            <div class="column">
              <a href=""><div class="newQuoteScratch">SCRATCH</div></a>
            </div>
            <div class="column">
              <a href=""><div class="newQuoteModule">MODULE</div></a>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <a href=""
                ><div class="newQuoteExItinerary">EXAMPLE ITINERARIES</div></a
              >
            </div>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>
<script>
export default {
  name: "BaseSideBar",
  props: ["open"],
};
</script>
