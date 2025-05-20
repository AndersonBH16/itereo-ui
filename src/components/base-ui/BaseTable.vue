<template>
  <section class="table-box mt-5 cursor-default">
    <b-field grouped group-multiline>
      <b-button
        label="Clear checked"
        type="is-danger"
        icon-left="close"
        class="field"
        @click="checkedRows = []"
      />
    </b-field>
    <b-tabs>
      <b-tab-item label="Recent itineraries">
        <b-table
          :data="data"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => row.id !== 3 && row.id !== 4"
          checkable
        >
          <template #bottom-left>
            <b>Total checked</b>: {{ checkedRows.length }}
          </template>

          <b-table-column field="user" label="User" width="155" v-slot="props">
            {{ props.row.user }}
          </b-table-column>

          <b-table-column field="code" label="Code" v-slot="props">
            {{ props.row.code }}
          </b-table-column>

          <b-table-column field="title" label="Title" v-slot="props">
            {{ props.row.title }}
          </b-table-column>

          <b-table-column field="paxs" label="Paxs" centered v-slot="props">
            {{ props.row.paxs }}
          </b-table-column>

          <b-table-column label="Travel" v-slot="props">
            {{ props.row.travel }}
          </b-table-column>

          <b-table-column field="update" label="Update" v-slot="props">
            {{ props.row.update }}
          </b-table-column>

          <b-table-column field="status" label="Status" v-slot="props">
            <span class="tag is-success">{{ props.row.status }}</span>
          </b-table-column>

          <b-table-column field="price" label="Price" numeric v-slot="props">
            {{ props.row.price }}
          </b-table-column>

          <b-table-column field="edit" label="Edit" width="50" centered>
            <a href="#"><IconPencil class="icon color-4 is-small" /></a>
          </b-table-column>
        </b-table>
      </b-tab-item>
      <b-tab-item label="Checked rows">
        <pre>{{ checkedRows }}</pre>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
export default {
  name: "BaseTable",
  data() {
    const data = [
      {
        user: "user@ela.com",
        code: "ELA-20201",
        title: "Ela Travel",
        paxs: "02",
        travel: "2021-03-17",
        update: "2020-08-27",
        status: "Enabled",
        price: "$3,583",
      },
      {
        user: "travel@ela.com",
        code: "ELA-20202",
        title: "Enjoy trip!",
        paxs: "02",
        travel: "2021-03-05",
        update: "2020-08-26",
        status: "Enabled",
        price: "$2,425",
      },
      {
        user: "admin@ela.com",
        code: "ELA-20203",
        title: "Adventure!",
        paxs: "02",
        travel: "2021-02-18",
        update: "2021-01-03",
        status: "Enabled",
        price: "$5,235",
      },
    ];
    return {
      data,
      checkedRows: [data[1], data[3]],
    };
  },
};
</script>
