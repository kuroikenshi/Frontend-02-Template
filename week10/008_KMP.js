function kmp(source, pattern) {
  // 计算table
  let table = new Array(pattern.length).fill(0);
  {
    let i = 1, j = 0;
    while(i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++j, ++i;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }
  }

  // 匹配逻辑
  {
    let i = 0, j = 0; // i是pattern串的，j是source串的
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        ++i, ++j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) {
        return true;
      }
    }
    // source串到头了
    return false;
  }
}

console.log(kmp('Hello', 'll'));
console.log(kmp('Helxlo', 'll'));

console.log(kmp('aabaabaaacx', 'aabaaac'));
console.log(kmp('abc', 'abc'));
