/**
 * 使用原生js，prototype
 */
var Animal = function(type) {
  this.type = type;
}
Animal.prototype.bite = function(targetInstance) {
  console.log((this.name || this.type) + '咬' + (targetInstance.name || targetInstance.type || '')) 
}

var Dog = function (name) {
  this.isDog = true; 
  this.name = name;
}
Dog.prototype = new Animal('狗');
Dog.prototype.bark = function () {
  console.log('汪汪汪');
}

var Human = function (name) {
  this.isHuman = true;
  this.name = name;
}
Human.prototype = new Animal('人类');
Human.prototype.heal = function (targetInstance) {
  console.log((this.name || this.type) + '治疗' + (targetInstance.name || targetInstance.type || ''))
}

// 测试
var xiaobai = new Dog('小白');
var xiaoxin = new Human('小新');

console.log(xiaobai, xiaoxin);
// 输出：Dog {isDog: true, name: "小白"} Human {isHuman: true, name: "小新"}

xiaobai.bark();           // 输出：汪汪汪
xiaobai.bite(xiaoxin);    // 输出：小白咬小新
xiaoxin.bite(xiaobai);    // 输出：小新咬小白
xiaoxin.heal(xiaobai);    // 输出：小新治疗小白
// xiaoxin.bark();           // 报错


/**
 * 使用ES6，class实现
 */
class AnimalClass {
  constructor(type) {
    this.type = type;
  }
  
  bite(targetInstance) {
    console.log((this.name || this.type) + '咬' + (targetInstance.name || targetInstance.type || ''));
  }
}

class DogClass extends AnimalClass {
  constructor(name) {
    super('狗');
    this.name = name;
  }
  
  bark() {
    console.log('汪汪汪');
  }
}

class HumanClass extends AnimalClass {
  constructor(name) {
    super('人类');
    this.name = name;
  }
  
  heal(targetInstance) {
    console.log((this.name || this.type) + '治疗' + (targetInstance.name || targetInstance.type || ''));
  }
}

// 测试
let dog = new DogClass('旺酱');
let human = new HumanClass('小力');

console.log(dog, human);
// 输出：DogClass {type: "狗", name: "旺酱"} HumanClass {type: "人类", name: "小力"}

dog.bark();           // 输出：汪汪汪
dog.bite(human);      // 输出：小白咬小新
human.bite(dog);      // 输出：小新咬小白
human.heal(dog);      // 输出：小新治疗小白
// human.bark();         // 报错
