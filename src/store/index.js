import Vue from "vue";
import Vuex from "vuex";
import Hex from "../classes/Hex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    centralHex: null,
    hexes: []
  },
  mutations: {
    initialize(state) {
      let centralHex = new Hex(0, 0);
      state.centralHex = centralHex;
      let firstRing = centralHex.createRing(1);
      state.hexes.push(centralHex, ...firstRing);
    }
  },
  actions: {
    startRenderLoop(store, { context, dimensions }) {
      // for some reason this makes all lines thinner and nicer
      // https://www.rgraph.net/canvas/docs/howto-get-crisp-lines-with-no-antialias.html
      context.translate(0.5, 0.5);

      const renderLoop = () => {
        context.clearRect(0, 0, dimensions.width, dimensions.height);

        store.state.hexes.forEach(hex => {
          hex.render(context, dimensions);
        });

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    }
  }
});
