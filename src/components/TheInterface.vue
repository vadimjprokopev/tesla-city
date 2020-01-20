<template>
  <div>
    <div>Money: {{ $store.state.money }}</div>
    <the-canvas />
    <button @click="increaseLightningFrequency">
      Increase frequency {{ $store.state.lightningSpawnPerPeriodPrice }}
    </button>
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
