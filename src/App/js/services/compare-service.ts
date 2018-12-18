export const compareService = {
  compareAny: compareAny,
  naturalStringCompare: naturalStringCompare
}

function compareAny(a: any, b: any): number {
  if (a === b) return 0;

  // NaN, and only NaN, will compare unequal to itself,
  // and is more reliable than isNaN(). Adding insult
  // to injury, NaN itself is not a number.
  // ReSharper disable once SimilarExpressionsComparison
  const aIsNaN = a !== a;
  // ReSharper disable once SimilarExpressionsComparison
  const bIsNaN = b !== b;

  if (typeof a === 'number' || typeof b === 'number' || aIsNaN || bIsNaN) {
    if (aIsNaN && bIsNaN) return 0;
    if (aIsNaN && !bIsNaN) return -1;
    if (!aIsNaN && bIsNaN) return +1;
    if (a === undefined && b !== undefined) return -1;
    if (a !== undefined && b === undefined) return +1;
    return a - b;
  }

  if (a !== null && b === null) return +1;
  if (a === null && b !== null) return -1;
  return a.localeCompare(b);
}

function naturalStringCompare(a: string | number, b: string | number): number {
  const isDigit = (c: any) => c >= '0' && c <= '9';
  const isNumber = this._.isNumber;

  enum ClassificationType { Undecided, Alpha, Number }

  type ChunkType = { content: string, classification: ClassificationType };

  function getChunk(str: string): ChunkType {
    const chars: string[] = [];
    let classification: ClassificationType = ClassificationType.Undecided;

    for (const c of str) {
      if (classification === ClassificationType.Undecided) {
        classification = isDigit(c) ? ClassificationType.Number : ClassificationType.Alpha;
      }
      else {
        const numeric = isDigit(c);
        if (classification === ClassificationType.Alpha && numeric) break;
        if (classification === ClassificationType.Number && !numeric) break;
      }
      chars.push(c);
    }

    return { content: chars.join(''), classification: classification };
  }

  while (true) {
    if (this._.isNull(a) && this._.isNull(b)) return 0;
    if (this._.isNull(a)) return -1;
    if (this._.isNull(b)) return 1;
    if (isNumber(a) && isNumber(b)) return +a - +b;

    a = a as string;
    b = b as string;
    if (a.length === 0 && b.length === 0) return 0;

    const ac = getChunk(a);
    const bc = getChunk(b);

    if (ac.classification === ClassificationType.Number
      && bc.classification === ClassificationType.Number
      && isNumber(+ac.content) && isNumber(+bc.content)) {
      const compare = +ac.content - +bc.content;
      if (compare < 0) return -1;
      if (compare > 0) return 1;
    }
    else {
      const result = ac.content.localeCompare(bc.content);
      if (result !== 0) return result;
    }

    a = (a as string).substring(ac.content.length);
    b = (b as string).substring(bc.content.length);
  }
}