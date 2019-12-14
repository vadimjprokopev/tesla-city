export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  rotate(rotationPoint, angle) {
    let newX =
      rotationPoint.x +
      (this.x - rotationPoint.x) * Math.cos(angle) +
      (this.y - rotationPoint.y) * Math.sin(angle);
    let newY =
      rotationPoint.y -
      (this.x - rotationPoint.x) * Math.sin(angle) +
      (this.y - rotationPoint.y) * Math.cos(angle);
    this.x = newX;
    this.y = newY;
  }

  add(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
  }

  findAngle(endPoint) {
    return Math.atan2(endPoint.y - this.y, endPoint.x - this.x);
  }

  distanceTo(anotherPoint) {
    return Math.sqrt(
      (this.x - anotherPoint.x) ** 2 + (this.y - anotherPoint.y) ** 2
    );
  }
}
