<template>
  <section class="table-box mt-5">
    <div class="columns">
      <div class="column">
        <h2 class="is-h2 mr-2 p-1 pb-3"><strong>Reports</strong></h2>
      </div>
      <div class="column has-text-right"></div>
    </div>
    <b-table :data="data">
      <b-table-column field="code" label="Code" v-slot="props" class="color-7">
        {{ props.row.code }}
      </b-table-column>
      <b-table-column field="title" label="Title" v-slot="props">
        {{ props.row.title }}
      </b-table-column>
      <b-table-column label="Travel" v-slot="props">
        {{ props.row.travel }}
      </b-table-column>
      <b-table-column field="update" label="Update" v-slot="props">
        {{ props.row.update }}
      </b-table-column>
      <b-table-column field="price" label="Price" numeric v-slot="props">
        {{ props.row.price }}
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
export default {
  name: "HomeQuoteTable",
  data() {
    const data = [
      {
        code: "ELA-R1",
        title: "Ela Travel",
        travel: "2021-03-17",
        update: "2020-08-27",
        price: "$3,583",
      },
      {
        code: "ELA-R2",
        title: "Enjoy trip!",
        travel: "2021-03-05",
        update: "2020-08-26",
        price: "$2,425",
      },
      {
        code: "ELA-R3",
        title: "Adventure!",
        travel: "2021-02-18",
        update: "2021-01-03",
        price: "$5,235",
      },
    ];
    return {
      data,
    };
  },
};
</script>
