export const ROWS = 4;
export const COLS = 4;

export function randomGenerate(blocks: number[][], chance4: number) {
  const available: [number, number][] = [];
  blocks.forEach((rowValue, row) => {
    rowValue.forEach((colValue, col) => {
      if (blocks[row][col] === 0) {
        available.push([row, col]);
      }
    });
  });
  if (available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    blocks[available[idx][0]][available[idx][1]] =
      Math.random() < chance4 ? 4 : 2;
  }
}

export function checkIsLost(blocks: number[][]) {
  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      for (let [orow, ocol] of [
        [1, 0],
        [0, +1],
      ]) {
        if (
          row + orow >= 0 &&
          col + ocol >= 0 &&
          row + orow < blocks.length &&
          col + ocol < blocks[row].length
        ) {
          if (blocks[row + orow][col + ocol] === blocks[row][col]) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
export const DEFAULT_CHANCE4 = 0.5;
export const DEFAULT_COLOR: Record<
  number,
  { background: string; text: string }
> = {
  0: { background: "rgba(200,200,200,0.2)", text: "#73695F" },
  2: { background: "#E7DDD1", text: "#73695F" },
  4: { background: "#E6D9C2", text: "#73695F" },
  8: { background: "#EAAB75", text: "#FFFFFF" },
  16: { background: "#ED9060", text: "#FFFFFF" },
  32: { background: "#EE785C", text: "#FFFFFF" },
  64: { background: "#DF6644", text: "#FFFFFF" },
  128: { background: "#E9CE77", text: "#FFFFFF" },
  256: { background: "#E8CA54", text: "#FFFFFF" },
  512: { background: "#E8BF51", text: "#FFFFFF" },
  1024: { background: "#E6BB48", text: "#FFFFFF" },
  2048: { background: "#E5BD2F", text: "#FFFFFF" },
  4096: { background: "#E76267", text: "#FFFFFF" },
  8192: { background: "#EB4858", text: "#FFFFFF" },
  16384: { background: "#EE3D3C", text: "#FFFFFF" },
  32768: { background: "#68AFD5", text: "#FFFFFF" },
  65536: { background: "#5993C6", text: "#FFFFFF" },
  131072: { background: "#157EC9", text: "#FFFFFF" },
};
