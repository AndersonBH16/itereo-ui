<template>
  <b-carousel
    class="z-index-1"
    v-model="carousel"
    :autoplay="false"
    :interval="20000"
    :repeat="true"
  >
    <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
      <section class="hero is-fullheight is-primary">
        <div class="hero-body has-text-centered m-auto">
          <h1 class="title relative is-2 z-index-1 texts">
            <span class="first">{{ carousel.primaryText }}</span>
            <span class="first"
              ><b>{{ carousel.secondaryText }}</b></span
            >
            <span class="subtitle is-3 second">
              Log in...and let the adventure begin.
            </span>
          </h1>
          <b-image
            class="is-16by9 static"
            :src="carousel.image"
            alt="Login Carousel"
          ></b-image>
        </div>
      </section>
    </b-carousel-item>
  </b-carousel>
</template>

<script>
export default {
  name: "CarouselLogin",
  data() {
    return {
      carousel: 0,
      carousels: [
        {
          image: "/img/Slider.svg",
          primaryText: "Travel Planning",
          secondaryText: "Done Right",
        },
        {
          image:
            "https://images.pexels.com/photos/3452236/pexels-photo-3452236.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
          primaryText: "Travel Planning",
          secondaryText: "Fast Quoting",
        },
        {
          image:
            "https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
          primaryText: "Travel Planning",
          secondaryText: "Beautiful Itineraries",
        },
        {
          image:
            "https://images.pexels.com/photos/3947403/pexels-photo-3947403.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
          primaryText: "Travel Planning",
          secondaryText: "Great Customer Experience",
        },
      ],
    };
  },
};
</script>
<style>
.carousel-item {
  display: block;
}
.texts {
  display: flex;
  flex-direction: column;
}
.texts .first {
  font-size: 52px;
  line-height: 62px;
  font-weight: normal;
}
.texts .second {
  margin-top: 6rem;
  font-size: 30px;
  line-height: 40px;
  font-weight: normal;
}
</style>
