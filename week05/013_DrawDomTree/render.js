const images = require('../node_modules/images');


function render(viewport, element) {
  if (element.style) {
    console.log('width height>>>', element.style.width, element.style.height);
    var img = images(element.style.width, element.style.height);

    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0,0,255)';

      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      let rgb = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3)];
      console.log('RGB >>>', rgb);
      img.fill(...rgb);
      console.log(element.style.left,  element.style.top);
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children) {
    for (var child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;
