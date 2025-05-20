<template>
  <PageWrapper>
    <Loading :loading="loading" :loadingText="loadingText" />
    <NavbarMain />
    <div class="columns mt-2">
      <div class="column">
        <RequestsSearchForm
          :setLoading="setLoading"
          @update:payload="payload = $event"
        />
      </div>
      <div class="column is-four-fifths">
        <div>
          <BaseButton
            size="large"
            @click="redirectToNewRequestCreation"
            action="tercery"
            class="is-pulled-right mb-4 is-relative"
            style="z-index: 1"
          >
            <IconPlus slot="icon" class="icon is-small" />
            <p slot="text">New Request</p>
          </BaseButton>
        </div>

        <b-table
          :data="adaptedRequests"
          ref="table"
          detailed
          hoverable
          custom-detail-row
          :opened-detailed="['Board Games']"
          detail-key="title"
          @details-open="
            (row, index) => $buefy.toast.open(`Expanded ${row.title}`)
          "
          :show-detail-icon="showDetailIcon"
        >
          <b-table-column
            field="client"
            :visible="columnsVisible['client'].display"
            :label="columnsVisible['client'].title"
            width="150"
            sortable
            v-slot="props"
          >
            <template v-if="showDetailIcon">
              <p class="has-one-line-ellipsis" style="max-width: 9rem">
                {{ props.row.client.name }}
              </p>
            </template>
            <template v-else>
              <a @click="toggle(props.row)">
                {{ props.row.client.name }}
              </a>
            </template>
          </b-table-column>

          <b-table-column
            field="code"
            :visible="columnsVisible['code'].display"
            :label="columnsVisible['code'].title"
            sortable
            centered
            v-slot="props"
          >
            <b-navbar-item
              tag="router-link"
              :to="{
                path: constants.PATH_INFO.REQUESTS_CREATION.path,
                query: { request: props.row.id },
              }"
              class="cursor quote__link is-flex is-justify-content-center is-align-items-center p-0"
              style="cursor: pointer"
            >
              <p class="has-one-line-ellipsis" style="max-width: 9rem">
                {{ props.row.code }}
              </p>
            </b-navbar-item>
          </b-table-column>

          <b-table-column
            field="title"
            :visible="columnsVisible['title'].display"
            :label="columnsVisible['title'].title"
            sortable
            centered
            v-slot="props"
          >
            <b-navbar-item
              tag="router-link"
              :to="{
                path: constants.PATH_INFO.REQUESTS_CREATION.path,
                query: { request: props.row.id },
              }"
              class="cursor quote__link is-flex is-justify-content-center is-align-items-center p-0"
              style="cursor: pointer"
            >
              <p class="has-one-line-ellipsis" style="max-width: 15rem">
                {{ props.row.title }}
              </p>
            </b-navbar-item>
          </b-table-column>

          <b-table-column
            field="nquotes"
            :visible="columnsVisible['nquotes'].display"
            :label="columnsVisible['nquotes'].title"
            sortable
            centered
            v-slot="props"
          >
            {{ props.row.quotes_number }}
          </b-table-column>

          <b-table-column
            field="user"
            :visible="columnsVisible['user'].display"
            :label="columnsVisible['user'].title"
            sortable
            centered
            v-slot="props"
          >
            <p class="has-one-line-ellipsis" style="max-width: 8rem">
              {{ props.row.user.name }}
            </p>
          </b-table-column>

          <b-table-column
            field="stage"
            :visible="columnsVisible['stage'].display"
            :label="columnsVisible['stage'].title"
            sortable
            centered
            v-slot="props"
          >
            <b-tag>
              {{ props.row.stage.name }}
            </b-tag>
          </b-table-column>

          <b-table-column
            field="creation"
            :visible="columnsVisible['creation'].display"
            :label="columnsVisible['creation'].title"
            sortable
            centered
            v-slot="props"
          >
            {{ props.row.creation }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="actions"
            :visible="columnsVisible['actions'].display"
            :label="columnsVisible['actions'].title"
            centered
          >
            <RequestsTableActions :data="props.row" :payload="payload" />
          </b-table-column>

          <template slot="detail" slot-scope="props">
            <tr>
              <th class="text-center">N°</th>
              <th>Client</th>
              <th class="has-text-centered">Code</th>
              <th class="has-text-centered">Title</th>
              <th class="has-text-centered">User</th>
              <th class="has-text-centered" span="1">Paxs</th>
              <th class="has-text-centered">Dates</th>
              <th class="has-text-centered">Status</th>
              <th class="has-text-centered">Creation</th>
            </tr>
            <tr
              v-for="(item, index) in props.row.items"
              :key="item.title"
              style="background-color: #f5f5f5"
            >
              <td v-if="showDetailIcon">
                {{ index + 1 }}
              </td>
              <td>
                <p class="has-one-line-ellipsis" style="max-width: 9rem">
                  {{ item.client.name }}
                </p>
              </td>
              <td class="has-text-centered">
                <b-navbar-item
                  tag="router-link"
                  :to="{
                    path: constants.PATH_INFO.BASIC_INFO.path,
                    query: { itinerary: item.id },
                  }"
                  class="cursor quote__link is-flex is-justify-content-center is-align-items-center p-0"
                  style="cursor: pointer"
                >
                  <p class="has-one-line-ellipsis" style="max-width: 9rem">
                    {{ item.code }}
                  </p>
                </b-navbar-item>
              </td>
              <td class="has-text-centered">
                <b-navbar-item
                  tag="router-link"
                  :to="{
                    path: constants.PATH_INFO.BASIC_INFO.path,
                    query: { itinerary: item.id },
                  }"
                  class="cursor quote__link is-flex is-justify-content-center is-align-items-center p-0"
                  style="cursor: pointer"
                >
                  <p class="has-one-line-ellipsis" style="max-width: 12rem">
                    {{ item.title }}
                  </p>
                </b-navbar-item>
              </td>
              <td class="has-text-centered">
                <p class="has-one-line-ellipsis" style="max-width: 8rem">
                  {{ item.user.name }}
                </p>
              </td>
              <td class="has-text-centered">{{ item.paxs }}</td>
              <td class="has-text-centered" style="width: 12rem">
                {{ item.dates }}
              </td>
              <td class="has-text-centered">
                <b-tag>{{ item.status.name }}</b-tag>
              </td>
              <td class="has-text-centered">{{ item.creation }}</td>
            </tr>
          </template>
        </b-table>

        <b-pagination
          class="mt-2 mb-0 quoteTablePagination"
          :total="requests.meta && requests.meta.total"
          v-model="payload.page"
          :range-before="3"
          :range-after="1"
          :rounded="false"
          size="is-small"
          order="is-centered"
          :per-page="requests.meta && requests.meta.per_page"
        >
          <template #default="props">
            <b-pagination-button
              :page="props.page"
              tag="button"
              :id="`page${props.page.number}`"
              @click.native="onSearchClick(payload)"
            >
              {{ props.page.number }}
            </b-pagination-button>
          </template>

          <template #previous="props">
            <b-pagination-button
              :page="props.page"
              @click.native="onSearchClick(payload)"
            >
              <IconArrowLeft class="icon_previous" />
            </b-pagination-button>
          </template>

          <template #next="props">
            <b-pagination-button
              :page="props.page"
              @click.native="onSearchClick(payload)"
            >
              <IconArrowRight class="icon_next" />
            </b-pagination-button>
          </template>
        </b-pagination>
      </div>
    </div>
  </PageWrapper>
</template>

<script>
import { mapGetters } from "vuex";
import helpers from "@/helpers";
import { PATH_INFO } from "@/router/path";
import PageWrapper from "@/components/_shared/PageWrapper.vue";
import NavbarMain from "@/components/_shared/NavbarMain.vue";
import RequestsTableActions from "@/components/requests/RequestsTableActions.vue";
import RequestsSearchForm from "@/components/requests/RequestsSearchForm.vue";
import Loading from "@/components/_shared/Loading.vue";
import { format } from "date-fns";

export default {
  name: "Requests",
  components: {
    RequestsTableActions,
    PageWrapper,
    NavbarMain,
    RequestsSearchForm,
    Loading,
  },
  data() {
    return {
      constants: { PATH_INFO },
      payload: {
        page: 1,
        text: [],
        client_id: null,
        stage_id: null,
        creation_date: null,
      },
      columnsVisible: {
        nquotes: { title: "N° Quotes", display: true },
        client: { title: "Client", display: true },
        code: { title: "Code", display: true },
        title: { title: "Title", display: true },
        creation: { title: "Creation", display: true },
        user: { title: "User", display: true },
        stage: { title: "Stage", display: true },
        actions: { title: "Actions", display: true },
      },
      showDetailIcon: true,
    };
  },
  computed: {
    ...mapGetters({
      loading: "utils/getLoading",
      loadingText: "utils/getLoadingText",
      authData: "auth/getAuthData",
      requests: "request/getRequests",
      datesFormat: "itinerary/getDatesFormat",
      clients: "client/getClients",
    }),
    backgroundImage() {
      return helpers.backgroundImage(
        "https://305c511294116d47a2eb-8984c8bf4382d773df005374b9639769.ssl.cf2.rackcdn.com/itereo/ttc/background_app.jpg"
      );
    },
    adaptedRequests() {
      return this.requests?.data?.map((request) => ({
        ...request,
        creation: format(request.creation, this.datesFormat),
        items: request.items?.map((item) => ({
          ...item,
          start_date: format(item.start_date, this.datesFormat),
          end_date: format(item.end_date, this.datesFormat),
          dates: `${format(item.start_date, this.datesFormat)} - ${format(
            item.end_date,
            this.datesFormat
          )}`,
          creation: format(item.creation, this.datesFormat),
        })),
      }));
    },
  },
  methods: {
    async onSearchClick(form) {
      this.setLoading(true);
      await this.$store.dispatch("request/getRequests", {
        ...form,
        title: form.text,
        code: form.text,
        client: form.client_id,
        stage: form.stage_id,
        creation: form.creation_date,
      });
      this.setLoading(false);
    },
    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },
    setLoading(value = false) {
      this.$store.dispatch("utils/setLoading", value);
      if (!value) {
        this.setLoadingText("Loading content, please wait...");
      }
    },
    setLoadingText(value = "") {
      this.$store.dispatch("utils/setLoadingText", value);
    },
    redirectToNewRequestCreation() {
      this.$router.push({
        path: PATH_INFO.REQUESTS_CREATION.path,
      });
    },
  },
};
</script>

<style scoped>
:is(.quote__link.navbar-item, .quote__link.navbar-item:hover, .quote__link.navbar-item:active, .quote__link.navbar-item:focus) {
  cursor: pointer;
  color: #f00b81 !important;
  background-color: transparent !important;
}
</style>
