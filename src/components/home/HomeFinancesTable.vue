<template>
  <section class="table-box mt-5">
    <div class="columns">
      <div class="column">
        <h2 class="is-h2 mr-2 p-1 pb-3"><strong>Finances</strong></h2>
      </div>
      <div class="column has-text-right"></div>
    </div>

    <b-table :data="data">
      <b-table-column field="user" label="User" width="155" v-slot="props">
        {{ props.row.user }}
      </b-table-column>

      <b-table-column field="code" label="Code" v-slot="props" class="color-7">
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
    </b-table>
  </section>
</template>

<script>
export default {
  name: "HomeFinancesTable",
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
    };
  },
};
</script>
