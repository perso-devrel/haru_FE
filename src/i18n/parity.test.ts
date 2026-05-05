import ko from './locales/ko';
import en from './locales/en';
import ja from './locales/ja';

type Dict = { [k: string]: string | Dict };

/** Recursively flatten the dictionary to dot-separated keys. */
function flatten(obj: Dict, prefix = ''): string[] {
  const out: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object') {
      out.push(...flatten(val as Dict, path));
    } else {
      out.push(path);
    }
  }
  return out.sort();
}

describe('i18n locale parity', () => {
  const koKeys = flatten(ko as unknown as Dict);
  const enKeys = flatten(en as unknown as Dict);
  const jaKeys = flatten(ja as unknown as Dict);

  it('ko, en and ja expose the exact same set of leaf keys', () => {
    const koOnlyVsEn = koKeys.filter((k) => !enKeys.includes(k));
    const enOnlyVsKo = enKeys.filter((k) => !koKeys.includes(k));
    const jaOnlyVsKo = jaKeys.filter((k) => !koKeys.includes(k));
    const koOnlyVsJa = koKeys.filter((k) => !jaKeys.includes(k));
    expect({ koOnlyVsEn, enOnlyVsKo, jaOnlyVsKo, koOnlyVsJa }).toEqual({
      koOnlyVsEn: [],
      enOnlyVsKo: [],
      jaOnlyVsKo: [],
      koOnlyVsJa: [],
    });
  });

  it('every leaf value is a non-empty string', () => {
    function collectEmpties(obj: Dict, prefix = ''): string[] {
      const bad: string[] = [];
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (val && typeof val === 'object') {
          bad.push(...collectEmpties(val as Dict, path));
        } else if (typeof val !== 'string' || val.length === 0) {
          bad.push(path);
        }
      }
      return bad;
    }
    expect(collectEmpties(ko as unknown as Dict)).toEqual([]);
    expect(collectEmpties(en as unknown as Dict)).toEqual([]);
    expect(collectEmpties(ja as unknown as Dict)).toEqual([]);
  });

  it('interpolation variables match across all locales', () => {
    // Pull {{name}} / {{count}} placeholders and ensure each key has the
    // same set across all locales (otherwise translators will silently drop
    // one).
    const koFlat = ko as unknown as Dict;
    const enFlat = en as unknown as Dict;
    const jaFlat = ja as unknown as Dict;

    function lookup(dict: Dict, path: string): string | undefined {
      const parts = path.split('.');
      let cur: Dict | string | undefined = dict;
      for (const p of parts) {
        if (cur && typeof cur === 'object') cur = (cur as Dict)[p];
        else return undefined;
      }
      return typeof cur === 'string' ? cur : undefined;
    }

    function varsOf(value: string | undefined): string[] {
      if (!value) return [];
      return [...value.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort();
    }

    const mismatched: { key: string; ko: string[]; en: string[]; ja: string[] }[] = [];
    for (const key of koKeys) {
      const k = varsOf(lookup(koFlat, key));
      const e = varsOf(lookup(enFlat, key));
      const j = varsOf(lookup(jaFlat, key));
      if (k.join(',') !== e.join(',') || k.join(',') !== j.join(',')) {
        mismatched.push({ key, ko: k, en: e, ja: j });
      }
    }
    expect(mismatched).toEqual([]);
  });
});
