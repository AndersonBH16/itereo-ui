<template>
  <div>
    <div class="p-5 ml-2 backgroundSecondary">
      <div class="table-box bg-white mt-5 mb-5 p-5">
        <div class="columns is-flex-mobile">
          <div class="column is-three-quarters BookCheckBoxs">
            <BookList />
            <BookPopup />
          </div>
          <div class="column">
            <img
              src="/img/book_avatar.png"
              alt="Logo"
              class="logo-sidebar-nav"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookList from "@/components/quote-views/book/BookList.vue";
import BookPopup from "@/components/quote-views/book/BookPopup.vue";

export default {
  name: "BookBox",
  components: {
    BookList,
    BookPopup,
  },
};
</script>
