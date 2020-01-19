import { segmentConstantLifetime, timestep } from "../Constants";

export default class Segment {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.alive = true;
    this.time = segmentConstantLifetime;
  }

  update() {
    if (!this.alive) {
      return;
    }

    this.time -= timestep;

    if (this.time <= 0) {
      this.alive = false;
    }
  }

  render(context) {
    context.moveTo(this.from.x, this.from.y);
    context.lineTo(this.to.x, this.to.y);
  }
}
