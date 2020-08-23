// https://www.khronos.org/registry/webgl/specs/latest/2.0/#3

let col = [];
let on = false;
$('body').children().each(function(){
    if (this.id == '3') {
        on = true;
        console.log('on');
    }
    if (this.id == '4') {
        on = false;
        console.log('off');
    }
    if (on && ['pre', 'dl'].indexOf(this.tagName.toLowerCase()) == -1) {
        col.push(this);
    }
});
let code = [];
col.map(e => {
    $(e).find('code').each(function(){
        code.push(this.innerText);
    });
});
console.log(code);