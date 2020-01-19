export function getGaussianRandom(mean, standardDeviation) {
  let v1, v2, s;
  do {
    v1 = 2 * Math.random() - 1;
    v2 = 2 * Math.random() - 1;
    s = v1 * v1 + v2 * v2;
  } while (s >= 1 || s == 0);

  s = Math.sqrt((-2 * Math.log(s)) / s);

  return mean + v1 * s * standardDeviation;
}
