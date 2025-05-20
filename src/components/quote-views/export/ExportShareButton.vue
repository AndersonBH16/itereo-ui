<template>
  <section>
    <div class="columns mb-3">
      <div class="column">
        <h2 class="is-h2 mr-2 p-1 pb-3"><strong>Export</strong></h2>
      </div>
      <div class="column">
        <BaseButton
          size="medium"
          @click="open = true"
          action="tercery"
          class="is-pulled-right"
        >
          <IconShare slot="icon" class="icon is-small" />
          <p slot="text">Share with mail</p>
        </BaseButton>
      </div>
    </div>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :overlay="true"
      :right="true"
      v-model="open"
      class="sidebarRight exportMailSidebar"
    >
      <div class="topCloseSideBar is-flex pr-5 p-2">
        <a @click="open = false" class="is-flex color-8">
          <IconChevronLeft class="icon is-small mr-2" />
          <span class="color-4 has-text-weight-medium"
            >Send mail to your client</span
          >
        </a>
        <a @click="open = false" class="color-8 sideBarCloseButton">
          <IconClose class="icon is-small" />
        </a>
      </div>
      <div class="p-5 SideBarBox">
        <p>Every time you share you will be sending the updated version.</p>
        <p class="color-4 mt-2">Last updated: 12/10/2020 - 14:20</p>
        <div class="mt-5">
          <BaseInput
            placeholder="Ex: client@email.com"
            type="email"
            size="large"
            label="Client's email *"
            class="mb-4"
          />
          <BaseInput
            placeholder="Ex: Encounter Latin America Quote"
            type="text"
            size="large"
            label="Subject *"
            class="mb-4"
          />
          <BaseTextarea
            type="textarea"
            placeholder="Add the description here"
            size="large"
            label="Description"
            class="mb-4"
          />
          <div class="has-text-centered">
            <router-link
              :to="{ path: paths.QUOTES.path }"
              class="sendMessageButtonContainer"
            >
              <BaseButton size="large" action="tercery" :disabled="true">
                <p slot="text">SEND MESSAGE</p>
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
import { PATH_INFO } from "@/router/path";

export default {
  name: "ExportShareSideBar",
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
      payload: {
        from: null,
        to: null,
        id: null,
      },
      paths: { ...PATH_INFO },
    };
  },
};
</script>
<style>
.sendMessageButtonContainer {
  width: 10rem;
  margin: auto;
}
</style>
