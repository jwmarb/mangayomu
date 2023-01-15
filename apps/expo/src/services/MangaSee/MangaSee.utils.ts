import { parse } from 'date-fns';

export function extractDataFromVariable(html: string | null) {
  return <T>(variableName: string): T => {
    if (html == null) throw Error('HTML is null');
    const match = html.match(new RegExp(`${variableName} = .*;`, 'g'));
    if (match == null) throw Error(`${variableName} does not exist`);
    const json = match[0].substring(variableName.length + 3);
    return JSON.parse(json);
  };
}

export function extractDataFromApplicationLDJson<T>(html: string | null): T {
  if (html == null) throw Error('HTML is null');
  const target = /"mainEntity":{((\s|.)*?)}/g;
  const obj = html.match(target);

  if (obj == null) throw Error('Invalid regular expression');
  const parsed = JSON.parse(
    `{${obj[0].replace(/ ".*" /g, (s) => {
      return s.replace(/"/g, '\\"');
    })}}`
  );

  return parsed;
}

export function extractFunctionFromVariable(html: string | null) {
  return <T extends (...args: any) => any>(fnName: string): T => {
    if (html == null) throw Error('HTML is null');
    const b = html.match(new RegExp(`${fnName}( = |=)function\\((.)*?\\){(\\s|.)*?}(;|,)`));

    if (b == null) throw Error('Invalid regexp');

    return new Function(
      `var ${b[0].replace(fnName, 'extractedFunction').replace('},', '};')} return extractedFunction`
    )();
  };
}

export function processScript(html: string | null) {
  return {
    variable: extractDataFromVariable(html),
    fn: extractFunctionFromVariable(html),
  };
}

export function parseMangaSeeDate(dateStr: string) {
  return parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date()).toString();
}
