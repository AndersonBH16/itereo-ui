<template>
  <div>
    <b-editable-table :items="tableData" :columns="tableColumns">
      <template #default="{ row }">
        <div>
          <button @click="toggleNested(row)">Toggle Nested Table</button>
          <div v-if="row.showNested">
            <b-table :items="row.nestedData" :columns="nestedColumns"></b-table>
          </div>
        </div>
      </template>
    </b-editable-table>
  </div>
</template>

<script>
import BEditableTable from "bootstrap-vue-editable-table";
export default {
  name: "ExampleNestedTable",
  components: {
    BEditableTable,
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "John",
          age: 30,
          showNested: false,
          nestedData: [
            { id: 1, hobby: "Reading" },
            { id: 2, hobby: "Cooking" },
          ],
        },
        {
          id: 2,
          name: "Mary",
          age: 25,
          showNested: false,
          nestedData: [
            { id: 1, hobby: "Singing" },
            { id: 2, hobby: "Dancing" },
          ],
        },
      ],
      tableColumns: [
        { field: "id", label: "ID", editable: false },
        { field: "name", label: "Name", editable: true },
        { field: "age", label: "Age", editable: true },
      ],
      nestedColumns: [
        { field: "id", label: "ID", editable: false },
        { field: "hobby", label: "Hobby", editable: true },
      ],
    };
  },
  methods: {
    toggleNested(row) {
      row.showNested = !row.showNested;
    },
  },
};
</script>
