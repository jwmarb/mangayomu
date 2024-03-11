/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'date-fns';

export function extractDataFromVariable(html: string | null) {
  return <T>(variableName: string): Promise<T> => {
    return new Promise((res, rej) => {
      if (html == null) return rej('HTML is null');
      const match = html.match(new RegExp(`${variableName} = .*;`, 'g'));
      if (match == null) return rej(`${variableName} does not exist.`);
      const json = match[0].substring(
        variableName.length + 3,
        match[0].length - 1,
      );
      res(JSON.parse(json));
    });
  };
}

export function extractDataFromApplicationLDJson<T>(
  html: string | null,
): Promise<T> {
  return new Promise((res, rej) => {
    if (html == null) return rej('HTML is null');
    const target = /"mainEntity":{((\s|.)*?)}/g;
    const obj = html.match(target);

    if (obj == null) return rej('Invalid regular expression.');
    const parsed = JSON.parse(
      `{${obj[0].replace(/ ".*" /g, (s) => {
        return s.replace(/"/g, '\\"');
      })}}`,
    );
    res(parsed);
  });
}

export function extractFunctionFromVariable(html: string | null) {
  return <T extends (...args: any) => any>(fnName: string): Promise<T> => {
    return new Promise((res, rej) => {
      if (html == null) return rej('HTML is null');
      const b = html.match(
        new RegExp(`${fnName}( = |=)function\\((.)*?\\){(\\s|.)*?}(;|,)`),
      );

      if (b == null) return rej('Invalid regexp');

      res(
        new Function(
          `var ${b[0]
            .replace(fnName, 'extractedFunction')
            .replace('},', '};')} return extractedFunction`,
        )(),
      );
    });
  };
}

export function processScript(html: string | null) {
  return {
    variable: extractDataFromVariable(html),
    fn: extractFunctionFromVariable(html),
  };
}

export function parseMangaSeeDate(dateStr: string) {
  return Date.parse(dateStr);
}
