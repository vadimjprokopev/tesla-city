import Vue from "vue";
import Vuex from "vuex";
import Hex from "../classes/Hex";
import {
  timestep,
  lightningSpawnPerPeriodIncrement,
  lightningSpawnPerPeriodPriceIncrease
} from "../Constants";
import Lightning from "../classes/Lightning";
import Point from "../classes/Point";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    centralHex: null,
    hexes: [],
    lightnings: [],
    lightningSpawnPerPeriod: 0.05,
    lightningSpawnPerPeriodPrice: 10,
    lightningCharge: 0.3,
    money: 10
  },
  mutations: {
    initialize(state) {
      let centralHex = new Hex(0, 0);
      state.centralHex = centralHex;
      let firstRing = centralHex.createRing(1);
      state.hexes.push(...firstRing);
    },
    increaseLightningFrequency(state) {
      if (state.money < state.lightningSpawnPerPeriodPrice) {
        return;
      }

      state.lightningSpawnPerPeriod += lightningSpawnPerPeriodIncrement;
      state.money -= state.lightningSpawnPerPeriodPrice;

      state.lightningSpawnPerPeriodPrice = Math.round(
        state.lightningSpawnPerPeriodPrice *
          lightningSpawnPerPeriodPriceIncrease
      );
    },
    addMoney(state, amount) {
      state.money += amount;
    }
  },
  actions: {
    startRenderLoop(store, { context, dimensions }) {
      // for some reason this makes all lines thinner and nicer
      // https://www.rgraph.net/canvas/docs/howto-get-crisp-lines-with-no-antialias.html
      context.setTransform(
        1,
        0,
        0,
        1,
        dimensions.center.x + 0.5,
        dimensions.center.y + 0.5
      );

      let delta = 0;
      let lastFrameTimeMs = 0;
      let lightningSpawnBuffer = 0;

      const renderLoop = timestamp => {
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        while (delta >= timestep) {
          store.state.lightnings.forEach(lightning => {
            lightning.update();
          });

          store.state.hexes.forEach(hex => {
            hex.update();
          });

          lightningSpawnBuffer += store.state.lightningSpawnPerPeriod;

          while (lightningSpawnBuffer >= 1) {
            lightningSpawnBuffer -= 1;

            let randomHex =
              store.state.hexes[
                Math.floor(Math.random() * store.state.hexes.length)
              ];

            store.state.lightnings.push(
              new Lightning(
                new Point(0, 0),
                randomHex.realPosition(),
                randomHex,
                store.state.lightningCharge
              )
            );
          }

          delta -= timestep;
        }

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, dimensions.width, dimensions.height);
        context.restore();

        store.state.centralHex.render(context, dimensions.center);

        store.state.hexes.forEach(hex => {
          hex.render(context);
        });

        store.state.lightnings = store.state.lightnings.filter(
          lightning => lightning.alive
        );

        store.state.lightnings.forEach(lightning => {
          lightning.render(context);
        });

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    }
  }
});
