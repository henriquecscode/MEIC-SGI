export function normalize(p1, p2, p3) {

    var norm  = Math.sqrt( Math.pow(p1, 2.0) + Math.pow(p2, 2.0) + Math.pow(p3, 2.0))
    return [p1 / norm, p2 / norm, p3 / norm];
  }