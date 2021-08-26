var kokopu = require('kokopu');

export function variationsEqual(var1: any, var2: any) {
  const node1 = var1.first();
  const node2 = var2.first();
  return (
    node1.fullMoveNumber == node2.fullMoveNumber &&
    node1.position().fen() == node2.position().fen()
  );
}
