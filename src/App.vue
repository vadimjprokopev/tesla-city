<template>
  <the-canvas />
</template>

<script>
import TheCanvas from "./components/TheCanvas.vue";

export default {
  name: "app",
  components: {
    TheCanvas
  },
  mounted() {
    this.$store.commit("initialize");
  }
};
</script>

<style></style>
