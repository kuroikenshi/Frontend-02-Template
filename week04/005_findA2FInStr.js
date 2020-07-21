function findA2FIn(str) {
  let startTarget = 'a';
  let goalTarget = 'f';
  let target = startTarget;
  for (let c of str) {
    if (c === target) {
      if (target === goalTarget) {
        return true;
      }
      else {
        target = String.fromCharCode(target.charCodeAt() + 1);
      }
    }
    else {
      target = startTarget;
      // 重置后立刻检查
      if (c === target) {
        target = String.fromCharCode(target.charCodeAt() + 1);
      }
    }
  }
  return false;
}

findA2FIn('abcabcdefdefg');
