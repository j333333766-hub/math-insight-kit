// 11/12 폴리패드 '시작 꼭짓점' 계산 (polypad-tess.html 이 쓴다)
// 폴리패드 타일 좌표 규칙(11/12 headless 로 확인): 타일 {x, y} = 외곽 상자의 가운데, rot = 시계 방향 각도(도), 한 변 50.
//   짝수각형(정사각형·정육각형·정팔각형·정십각형·정십이각형)은 rot 0 일 때 윗변이 수평, 홀수각형(정삼각형·정오각형)은 꼭짓점이 위.
// 꼭짓점 배열(예: [3,4,6,4])을 받아 한 점에 둘러 모인 타일 목록을 돌려준다.
(function () {
  const S = 50;
  const SHAPE = { 3: 'equ-triangle', 4: 'square', 5: 'reg-pentagon', 6: 'reg-hexagon', 8: 'reg-octagon', 10: 'reg-decagon', 12: 'reg-dodecagon' };
  const COLOR = { 3: '#fd8c00', 4: '#0f82f2', 5: '#22ab24', 6: '#cd0e66', 8: '#6d3bbf', 10: '#c1a300', 12: '#009ea6' };
  const NAME = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 8: '정팔각형', 10: '정십각형', 12: '정십이각형' };
  const rad = (d) => d * Math.PI / 180;
  // rot 0 일 때 중심(외접원 중심)에서 본 꼭짓점 하나의 각도(화면 좌표, y 아래로)
  const baseAngle = (n) => (n % 2 ? -90 : -90 + 180 / n);
  // 외접원 중심 → 외곽 상자 가운데로 옮기는 양(rot 0 기준, 홀수각형만)
  const boxOffset = (n, R) => (n % 2 ? -R * (1 - Math.cos(Math.PI / n)) / 2 : 0);
  function vertexTiles(seq, cx, cy, start = -90) {
    const tiles = []; let a = start;
    for (const n of seq) {
      const alpha = 180 - 360 / n, R = S / (2 * Math.sin(Math.PI / n));
      const mid = a + alpha / 2;
      const ox = cx + R * Math.cos(rad(mid)), oy = cy + R * Math.sin(rad(mid)); // 외접원 중심
      const rot = ((mid + 180 - baseAngle(n)) % 360 + 360) % 360;              // 그 꼭짓점이 (cx, cy) 에 오게
      const off = boxOffset(n, R);                                              // (0, off) 를 rot 만큼 돌려 더한다
      const x = ox - off * Math.sin(rad(rot)), y = oy + off * Math.cos(rad(rot));
      tiles.push({ name: 'polygon', shape: SHAPE[n], x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000, rot: Math.round(rot * 1000) / 1000, color: COLOR[n] });
      a += alpha;
    }
    return tiles;
  }
  // 타일 개수의 비(꼭짓점에 모이는 n각형 수 ÷ n) → 가장 작은 정수비
  function ratio(seq) {
    const k = {}; seq.forEach((n) => (k[n] = (k[n] || 0) + 1));
    const ns = Object.keys(k).map(Number).sort((p, q) => p - q);
    const L = ns.reduce((l, n) => l * n / gcd(l, n), 1);
    let v = ns.map((n) => k[n] * L / n); const g = v.reduce(gcd); v = v.map((x) => x / g);
    return ns.map((n, i) => [n, v[i]]);
  }
  function gcd(p, q) { return q ? gcd(q, p % q) : p; }
  window.TessVertex = { vertexTiles, ratio, SHAPE, NAME, COLOR };
})();
