function find(str) {
  let state = start;
  for(let c of str) {
      state = state(c);
  }
  return state === end;

  function start(c) {
    if (c === "a") {
      return foundA;
    }
    else {
      return start;
    }
  }

  function end(c) {
    return end;
  }

  function foundA(c) {
    if (c === 'b') {
      return foundB;
    }
    else {
      return start(c);
    }
  }

  function foundB(c) {
    if (c === 'a') {
      return foundA2;
    }
    else {
      return start(c);
    }
  }

  function foundA2(c) {
    if (c === 'b') {
      return foundB2;
    }
    else {
      return foundA(c);
    }
  }

  function foundB2(c) {
    if (c === 'a') {
      return foundA3
    }
    else {
      return foundA2(c);
    }
  }

  function foundA3(c) {
    if (c === 'b') {
      return foundB3;
    }
    else {
      return foundB2(c);
    }
  }

  function foundB3(c) {
    if (c === 'x') {
      return end;
    }
    else {
      return foundB2(c);
    }
  }
}

console.log(find('abababx'));
console.log(find('ababababx'));
console.log(find('abaaababx'));
