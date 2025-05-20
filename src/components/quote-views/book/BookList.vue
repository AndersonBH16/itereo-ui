<template>
  <div>
    <h2 class="is-h2 pb-5">
      <strong>Book</strong>
    </h2>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium</b-checkbox
        >
      </b-field>
    </p>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Doloremque laudantium, totam rem aperiam, eaque ipsa quae abillo
        </b-checkbox>
      </b-field>
    </p>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo.
        </b-checkbox>
      </b-field>
    </p>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        </b-checkbox>
      </b-field>
    </p>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.
        </b-checkbox>
      </b-field>
    </p>
    <p class="my-2">
      <b-field>
        <b-checkbox
          >Neque porro quisquam est, qui dolorem ipsum quia dolor.
        </b-checkbox>
      </b-field>
    </p>
  </div>
</template>

<script>
export default {
  name: "BookList",
  data() {
    return {
      checkbox: false,
      checkboxCustom: "Yes",
    };
  },
};
</script>
