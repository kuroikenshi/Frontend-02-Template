// 查找字符串中所有a
function getAIndexFrom(str) {
  if (typeof str !== 'string') {
    throw new Error('The "str" you give me is NOT a string !! Are you kidding me? Is that so funny? Huh??');
  }
  let result = str.matchAll(/a/g);
  
  let indexCollector = [...result].reduce((total, current) => {
    total.push(current.index);
    return total;
  }, []);
  
  return indexCollector;
}


// 测试数据
console.log(getAIndexFrom('asdfasdfasdfasdf'));
console.log(getAIndexFrom(''));
console.log(getAIndexFrom());
