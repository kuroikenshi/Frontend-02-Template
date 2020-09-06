function find(source, pattern) {
  let starCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      starCount ++;
    }
  }
  if (starCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return;
  }

  let i = 0;
  let lastIndex = 0;

  for (i = 0; pattern[i] !== '*'; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== '?') {
      return false;
    }
  }

  lastIndex = i;

  for (let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }

    let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
    reg.lastIndex = lastIndex;  // 接着之前的去找

    // console.log(reg.exec(source));

    if (!reg.exec(source)) {
      return false;
    }

    lastIndex = reg.lastIndex;
  }

  // 匹配最后一个星号之后的部分
  for (let j = 0; (j <= (source.length - lastIndex) && pattern[pattern.length - j] !== '*'); j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] &&
        pattern[pattern.length - j] !== '?') {
      return false;
    }
  }
  return true;

}

console.log(find('abcabcabxaac', 'a*b*bx*c'));

console.log(find('abcabcabxaac', 'a*b?*b?x*c'));

