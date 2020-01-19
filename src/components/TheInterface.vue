<template>
  <div>
    <the-canvas />
    <button @click="increaseLightningFrequency">Increase frequency</button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import TheCanvas from "./TheCanvas";

export default {
  components: {
    TheCanvas
  },
  methods: {
    ...mapMutations(["increaseLightningFrequency"])
  }
};
</script>
