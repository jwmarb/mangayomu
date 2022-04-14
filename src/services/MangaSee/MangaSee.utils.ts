export function extractDataFromVariable(html: string | null) {
  return (variableName: string) => {
    if (html == null) throw Error('HTML is null');
    const match = html.match(new RegExp(`${variableName} = .*;`, 'g'));
    if (match == null) throw Error(`${variableName} does not exist`);
    const json = match[0].substring(variableName.length + 3);
    return JSON.parse(json);
  };
}

export function extractFunctionFromVariable(html: string | null) {
  return (fnName: string) => {
    if (html == null) throw Error('HTML is null');
    const splitted = html.split('\n');
    let start = 0;
    let end = -1;
    let i = 0;
    const regex = new RegExp(`${fnName} = .*`);
    const closingBracket = /};/g;
    while (end === -1) {
      if (regex.test(splitted[i])) {
        start = i;
        let j = i;
        while (end === -1) {
          if (closingBracket.test(splitted[j])) {
            end = j;
          }
          j++;
        }
      }
      i++;
    }

    const linesContainingFunctionContent = splitted
      .slice(start, end + 1) // from lines start to end, we get the content of the function
      .map((x, i) => {
        switch (i) {
          case 0:
            return x.replace(`${fnName}`, 'extractedFunction').trim();
          default:
            return x.trim();
        }
      });

    linesContainingFunctionContent.push(`return extractedFunction;`);

    return new Function('var ' + linesContainingFunctionContent.join(''))();
  };
}

export function processScript(html: string | null) {
  return {
    variable: extractDataFromVariable(html),
    fn: extractFunctionFromVariable(html),
  };
}
