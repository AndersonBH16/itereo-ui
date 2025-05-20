<template>
  <b-modal title="Entity Tags" size="xl" v-model="isOpen" @close="closeModal()">
    <div class="service_replace_modal">
      <div style="height: 25vh">
        <b-field label="Tags" class="header_select" style="width: 100%">
          <Multiselect
            v-model="currentTags"
            :options="filteredTags"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
            tag-position="top"
            :max-height="200"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            :allow-empty="true"
            placeholder="Select or create a tag"
            :disabled="disableQuoteByStatus || hideElementByCondition"
          >
          </Multiselect>
        </b-field>
      </div>
      <div class="is-flex is-justify-content-flex-end">
        <BaseButton
          v-if="!hideElementByCondition"
          size="small"
          :loading="loading"
          @click="save"
          :disabled="disableQuoteByStatus"
        >
          <i slot="icon">
            <IconCheck class="icon is-small" />
          </i>
          <div slot="text">Save</div>
        </BaseButton>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import { TAG_TYPES } from "@/constants";

export default {
  name: "EntityTagModal",
  components: {
    Multiselect,
  },
  props: {
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      requires: true,
    },
    entityTags: {
      type: Array,
      requires: [],
    },
    saveTags: {
      type: Function,
      default: () => {},
    },
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      tags: "tags/list",
      disableQuoteByStatus: "itinerary/getDisableQuoteByStatus",
      hideElementByCondition: "itinerary/getHideElementByCondition",
    }),
    filteredTags() {
      const types = [TAG_TYPES.TOD, this.type];
      return this.tags
        .filter((tag) => types.includes(tag.type))
        .map((tag) => tag.name)
        .concat(this.newTags);
    },
  },
  data() {
    return {
      currentTags: [],
      newTags: [],
      loading: false,
      isOpen: false,
    };
  },
  mounted() {
    this.currentTags = this.entityTags.map((tag) => tag.name);
  },
  watch: {
    isModalOpen(newValue) {
      this.isOpen = newValue;
    },
  },
  methods: {
    async save() {
      this.loading = true;
      const tags = await this.$store.dispatch("tags/save", {
        data: {
          type: this.type,
          tags: this.currentTags,
        },
        cur_step: 1,
        last_step: 2,
      });
      const tagIds = tags
        .filter((tag) => this.currentTags.includes(tag.name))
        .map((tag) => tag.id);
      await this.saveTags({
        tagIds,
        cur_step: 2,
        last_step: 2,
      });
      this.loading = false;
    },
    addTag(newTag) {
      this.currentTags.push(newTag);
      this.newTags.push(newTag);
    },
  },
};
</script>
<style>
.service_replace_modal {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 1rem;
  padding: 2rem 2rem 3rem;
  text-align: center;
}
.service_replace_modal :is(h1, h2) {
  text-align: left;
}
.modal__body__content {
  width: 100%;
}
.service_replace_modal table :is(th, td) {
  font-size: 1rem;
}
</style>
