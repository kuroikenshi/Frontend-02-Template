// 不使用正则，找到字符串中连续的ab
function findAB(str) {
	for (let i = 0; i < str.length; i++) {
		if (str[i] === 'a' && i < str.length - 1 && str[i + 1] === 'b') {
			return true;
		}
	}
	return false;
}

console.log(findAB('asdfabasdf'));
console.log(findAB('asdfasdf'));
