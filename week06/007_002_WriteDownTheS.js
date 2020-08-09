// 请写出一下4种选择器的优先级

div#a.b .c[id=x]
[0, 1, 3, 1]


#a:not(#b)
[0, 2, 0, 0]


*.a
[0, 0, 1, 0]


div.a
[0, 0, 1, 1]


// 参考资料：https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity