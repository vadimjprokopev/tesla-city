import Point from "./Point";
import store from "../store";

const angle = Math.PI / 3;
const length = 30;
const value = 10;
const minDischargeRate = 0.05;
const dischargeRate = 0.05;

export default class Hex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.charge = 0;
  }

  static directions() {
    return [
      [1, -1],
      [1, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [0, -1]
    ];
  }

  createRing(distance) {
    let hexes = [];

    let xNew = this.x + Hex.directions()[4][0] * distance;
    let yNew = this.y + Hex.directions()[4][1] * distance;

    for (let i = 0; i <= 5; i++) {
      for (let j = 1; j <= distance; j++) {
        hexes.push(
          new Hex(
            (xNew += Hex.directions()[i][0]),
            (yNew += Hex.directions()[i][1])
          )
        );
      }
    }

    return hexes;
  }

  realPosition() {
    const xOffset = this.x * 1.5 * length;
    const yOffset =
      Math.sqrt(3) * this.y * length + this.x * length * Math.cos(Math.PI / 6);
    return new Point(xOffset, yOffset);
  }

  render(context) {
    context.beginPath();

    context.moveTo(
      1.5 * this.x * length + length * Math.cos(0),
      Math.sqrt(3) * this.y * length +
        this.x * length * Math.cos(Math.PI / 6) +
        length * Math.sin(0)
    );

    for (let i = 1; i <= 6; i++) {
      context.lineTo(
        1.5 * this.x * length + length * Math.cos(angle * i),
        Math.sqrt(3) * this.y * length +
          this.x * length * Math.cos(Math.PI / 6) +
          length * Math.sin(angle * i)
      );
    }
    context.stroke();

    const leftX = 1.5 * this.x * length + length * Math.cos(angle * 2);
    const rightX = 1.5 * this.x * length + length * Math.cos(angle * 5);
    const bottomY =
      Math.sqrt(3) * this.y * length +
      this.x * length * Math.cos(Math.PI / 6) +
      length * Math.sin(angle * 2);
    const topY =
      Math.sqrt(3) * this.y * length +
      this.x * length * Math.cos(Math.PI / 6) +
      length * Math.sin(angle * 4);

    context.beginPath();

    context.moveTo(leftX, bottomY);

    context.lineTo(leftX, bottomY + this.charge * (topY - bottomY));

    context.lineTo(rightX, bottomY + this.charge * (topY - bottomY));

    context.lineTo(rightX, bottomY);

    context.fill();
  }

  update() {
    let discharge = Math.min(
      Math.max(dischargeRate * this.charge, minDischargeRate),
      this.charge
    );
    this.charge -= discharge;
    store.commit("addMoney", value * discharge);
  }

  activate(charge) {
    this.charge = Math.min(1, this.charge + charge);
  }
}
