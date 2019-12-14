<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Point from "../classes/Point";

export default {
  mounted() {
    let width = 1280;
    let height = 720;

    this.$refs["canvas"].width = width;
    this.$refs["canvas"].height = height;

    let context = this.$refs["canvas"].getContext("2d");
    let dimensions = {
      center: new Point(width / 2, height / 2),
      height,
      width
    };

    this.startRenderLoop({ context, dimensions });
  },

  methods: {
    ...mapActions(["startRenderLoop"])
  }
};
</script>
