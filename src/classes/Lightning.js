import Segment from "./Segment";
import { getGaussianRandom } from "./Util";
import {
  lightningSegmentsPerUpdate,
  maxLength,
  minLength,
  standardDeviation,
  branchingChance,
  branchingLengthModifier,
  branchingAngleMean
} from "../Constants";

export default class Lightning {
  constructor(startPoint, targetPoint, target, charge) {
    this.branches = [];
    this.segments = [];
    this.previousPoint = startPoint;
    this.targetPoint = targetPoint;
    this.reachedTarget = false;
    this.segmentSpawnBuffer = 0;
    this.alive = true;
    this.target = target;
    this.charge = charge;
  }

  update() {
    if (!this.alive) {
      return;
    }

    if (
      this.reachedTarget &&
      this.segments.length === 0 &&
      this.branches.length === 0
    ) {
      this.alive = false;
      return;
    }

    this.branches = this.branches.filter(branch => branch.alive);
    this.branches.forEach(branch => branch.update());
    this.segments = this.segments.filter(segment => segment.alive);
    this.segments.forEach(segment => segment.update());

    if (this.reachedTarget) {
      return;
    }

    this.segmentSpawnBuffer += lightningSegmentsPerUpdate;

    while (this.segmentSpawnBuffer >= 1) {
      this.segmentSpawnBuffer -= 1;
      let distanceToTarget = Math.sqrt(
        (this.targetPoint.y - this.previousPoint.y) ** 2 +
          (this.targetPoint.x - this.previousPoint.x) ** 2
      );

      if (distanceToTarget <= maxLength) {
        this.segments.push(new Segment(this.previousPoint, this.targetPoint));
        this.reachedTarget = true;
        if (this.target) {
          this.target.activate(this.charge);
        }
        break;
      }

      let angleToTarget = -Math.atan2(
        this.targetPoint.y - this.previousPoint.y,
        this.targetPoint.x - this.previousPoint.x
      );
      let randomAngle = getGaussianRandom(angleToTarget, standardDeviation);
      let nextPoint = this.previousPoint.add(
        minLength + Math.random() * (maxLength - minLength),
        0
      );
      nextPoint.rotate(this.previousPoint, randomAngle);
      this.segments.push(new Segment(this.previousPoint, nextPoint));

      if (Math.random() <= branchingChance) {
        let branchingTargetPoint = this.previousPoint.add(
          distanceToTarget * branchingLengthModifier,
          0
        );
        branchingTargetPoint.rotate(
          this.previousPoint,
          angleToTarget + branchingAngleMean
        );
        this.branches.push(
          new Lightning(this.previousPoint, branchingTargetPoint)
        );
      }

      if (Math.random() <= branchingChance) {
        let branchingTargetPoint = this.previousPoint.add(
          distanceToTarget * branchingLengthModifier,
          0
        );
        branchingTargetPoint.rotate(
          this.previousPoint,
          angleToTarget - branchingAngleMean
        );
        this.branches.push(
          new Lightning(this.previousPoint, branchingTargetPoint)
        );
      }

      this.previousPoint = nextPoint;
    }
  }

  renderBranch(context) {
    this.segments.forEach(segment => segment.render(context));
  }

  render(context) {
    context.beginPath();
    this.branches.forEach(branch => branch.renderBranch(context));
    this.renderBranch(context);
    context.stroke();
  }
}
