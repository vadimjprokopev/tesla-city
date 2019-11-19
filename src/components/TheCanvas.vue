<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  mounted() {
    let width = 1280;
    let height = 720;

    this.$refs["canvas"].width = width;
    this.$refs["canvas"].height = height;

    let context = this.$refs["canvas"].getContext("2d");
    let dimensions = { x: width / 2, y: height / 2, height, width };

    this.startRenderLoop({ context, dimensions });
  },

  methods: {
    ...mapActions(["startRenderLoop"])
  }
};
</script>
