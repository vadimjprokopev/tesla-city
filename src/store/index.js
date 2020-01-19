import Vue from "vue";
import Vuex from "vuex";
import Hex from "../classes/Hex";
import { timestep, lightningSpawnPerPeriod } from "../Constants";
import Lightning from "../classes/Lightning";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    centralHex: null,
    hexes: [],
    lightnings: []
  },
  mutations: {
    initialize(state) {
      let centralHex = new Hex(0, 0);
      state.centralHex = centralHex;
      let firstRing = centralHex.createRing(1);
      state.hexes.push(...firstRing);
    }
  },
  actions: {
    startRenderLoop(store, { context, dimensions }) {
      // for some reason this makes all lines thinner and nicer
      // https://www.rgraph.net/canvas/docs/howto-get-crisp-lines-with-no-antialias.html
      context.translate(0.5, 0.5);

      let delta = 0;
      let lastFrameTimeMs = 0;
      let lightningSpawnBuffer = 0;

      const renderLoop = timestamp => {
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        while (delta >= timestep) {
          lightningSpawnBuffer += lightningSpawnPerPeriod;

          while (lightningSpawnBuffer >= 1) {
            lightningSpawnBuffer -= 1;

            let randomHex =
              store.state.hexes[
                Math.floor(Math.random() * store.state.hexes.length)
              ];

            store.state.lightnings.push(
              new Lightning(
                dimensions.center,
                dimensions.center.add(
                  randomHex.offsetFromCenter().x,
                  randomHex.offsetFromCenter().y
                )
              )
            );
          }

          delta -= timestep;
        }

        context.clearRect(0, 0, dimensions.width, dimensions.height);

        store.state.centralHex.render(context, dimensions.center);

        store.state.hexes.forEach(hex => {
          hex.render(context, dimensions.center);
        });

        store.state.lightnings = store.state.lightnings.filter(
          lightning => lightning.alive
        );

        store.state.lightnings.forEach(lightning => {
          lightning.update();
          lightning.render(context);
        });

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    }
  }
});
