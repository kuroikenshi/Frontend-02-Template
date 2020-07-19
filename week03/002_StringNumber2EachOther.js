// 自动转成对应类型的number
function StringToNumber(numberString) {
  let n16reg = new RegExp('^([\-\+]?)0x([0-9a-fA-F]*)$');
  let n8reg = new RegExp('^([\-\+]?)0o([0-7]*)$');
  let n2reg = new RegExp('^([\-\+]?)0b([0-1]*)$');
  let n10reg = new RegExp('^([\-\+]?)(\\d*)\\.?(\\d*)e?([\-\+]?)(\\d*)$');
  
  const numberMap = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15
  };
  
  // 16进制校验
  if (n16reg.test(numberString)) {
    
    // 取出数字str部分
    let sign = numberString.match(n16reg)[1];
    let numberStr = numberString.match(n16reg)[2];
    
    if (numberStr.length == 0) {
      return 0;
    }
    else {
      let num = 0;
      // 累加：每位数字 * 当前位实际值
      Array.from(numberStr.toUpperCase()).map((value, index) => {
        num += (16 ** (numberStr.length - index - 1)) * numberMap[value];
      });
      
      // 处理符号位
      if (sign !== '') {
        if (sign === '-') {
          num = -1 * num;
        }
        else if (sign === '+') {
          num = 1 * num;
        }
        else {
          return NaN;
        }
      }
      
      return num;
    }
  }
  // 8进制校验
  // 0o开头后边只出现0~7数字
  // 以0开头都算8进制的，已经列为不推荐语法，顾此处不处理
  else if (n8reg.test(numberString)) {
    
    let sign = numberString.match(n8reg)[1];
    let numberStr = numberString.match(n8reg)[2];
    
    if (numberStr.length == 0) {
      return 0;
    }
    else {
      let num = 0;
      Array.from(numberStr.toUpperCase()).map((value, index) => {
        num += (8 ** (numberStr.length - index - 1)) * numberMap[value];
      });
      
      // 处理符号位
      if (sign !== '') {
        if (sign === '-') {
          num = -1 * num;
        }
        else if (sign === '+') {
          num = 1 * num;
        }
        else {
          return NaN;
        }
      }
      
      return num;
    }
  }
  // 2进制校验
  else if (n2reg.test(numberString)) {
    
    let sign = numberString.match(n2reg)[1];
    let numberStr = numberString.match(n2reg)[2];
    
    if (numberStr.length == 0) {
      return 0;
    }
    else {
      let num = 0;
      Array.from(numberStr.toUpperCase()).map((value, index) => {
        num += (2 ** (numberStr.length - index - 1)) * numberMap[value];
      });
      
      // 处理符号位
      if (sign !== '') {
        if (sign === '-') {
          num = -1 * num;
        }
        else if (sign === '+') {
          num = 1 * num;
        }
        else {
          return NaN;
        }
      }
      
      return num;
    }
  }
  // 10进制
  else if (n10reg.test(numberString)) {
    
    let matchResult = numberString.match(n10reg);
    let sign1 = matchResult[1];
    let integerStr = matchResult[2] == '' ? '0' : matchResult[2];
    let decimalStr = matchResult[3] == '' ? '0' : matchResult[3];
    let sign2 = matchResult[4];
    let powerStr = matchResult[5] == '' ? '0' : matchResult[5];
    
    let num = 0;
    // 处理整数部分
    Array.from(integerStr.toUpperCase()).map((value, index) => {
      num += (10 ** (integerStr.length - index - 1)) * numberMap[value];
    });
    // 处理小数部分
    Array.from(decimalStr.toUpperCase()).map((value, index) => {
      num += (10 ** (index - 1)) * numberMap[value];
    });
    
    // 处理符号位1
    if (sign1 !== '') {
      if (matchResult[2] === '' && matchResult[3] === '') {
        return NaN;
      }
      
      if (sign1 === '-') {
        num = -1 * num;
      }
      else if (sign1 === '+') {
        num = 1 * num;
      }
      else {
        return NaN;
      }
    }
    
    // 处理科学技术部分
    let exNum = 0;
    Array.from(powerStr.toUpperCase()).map((value, index) => {
      exNum += (10 ** (powerStr.length - index - 1)) * numberMap[value];
    });
    
    // 处理符号位2
    if (sign2 !== '') {
      // 有符号2，但是没有科学技术位
      if (matchResult[5] === '') {
        return NaN;
      }
      
      if (sign2 === '-') {
        exNum = -1 * exNum;
      }
      else if (sign2 === '+') {
        exNum = 1 * exNum;
      }
      else {
        return NaN;
      }
    }
    
    num = num * 10 ** exNum;
    
    return num;
  }
  else {
    return NaN;
  }
}

// 测试
console.log('10进制');
console.log(StringToNumber(''));
console.log(StringToNumber('1'));
console.log(StringToNumber('-2'));
console.log(StringToNumber('3.1'));
console.log(StringToNumber('4.'));
console.log(StringToNumber('.5'));
console.log(StringToNumber('6.1e1'));
console.log(StringToNumber('7.1e-2'));
console.log(StringToNumber('.8e3'));
console.log(StringToNumber('-9e-4'));

console.log('16进制');
console.log(StringToNumber('0x'));
console.log(StringToNumber('0xFF'));
console.log(StringToNumber('0xff'));
console.log(StringToNumber('-0xff'));

console.log('2进制');
console.log(StringToNumber('0b'));
console.log(StringToNumber('0b111'));
console.log(StringToNumber('-0b111'));

console.log('8进制');
console.log(StringToNumber('0o'));
console.log(StringToNumber('0o567'));
console.log(StringToNumber('-0o567'));

console.log('NaN');
console.log(StringToNumber('-+1'));
console.log(StringToNumber('1.2.3'));
console.log(StringToNumber('1a.2'));
console.log(StringToNumber('0xEGG'));
console.log(StringToNumber('0b233'));
console.log(StringToNumber('0o999'));


// 将输入数字number转换为指定进制的字符串
function NumberToString(number, numberBase) {
  const numberMap = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'A',
    11: 'B',
    12: 'C',
    13: 'D',
    14: 'E',
    15: 'F'
  };
  if (number !== parseInt(number)) {
    throw new Error('输入数字只支持整数');
  }
  if (numberBase > 16 || numberBase < 2) {
    throw new Error('进制只支持2~16之间的数字');
  }
  else {
    let numberStrList = [];
    while (number / numberBase > 0) {
      remainder = number % numberBase;
      quotient = parseInt(number / numberBase);
      
      numberStrList.push(remainder);
      number = quotient;
    }
    
    return numberStrList.reverse().reduce((result, item) => {
      return result + numberMap[item]
    }, '');
  }
}

// 测试
console.log('10进制数字 -> 指定进制字符串')
console.log(NumberToString(255, 16));
console.log(NumberToString(0xFF, 16));
console.log(NumberToString(255, 8));
console.log(NumberToString(255, 2));

/**
 * 参考资料：
 * 
 * https://blog.csdn.net/luzhensmart/article/details/102594194
 */