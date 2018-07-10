import 'res/css/base';
import 'res/css/index.styl';
import apple from './apple.png'

export default function printMe() {
  console.warn('[警告提示]:')
}
console.log(apple)
printMe()
//document.body.innerHTML = "新的内容...";

// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true; //如果需要Cookie等
// xhr.open('POST', 'https://ui.nmtree.com/demo.php');
// xhr.onload = function(e) {
//   var data = JSON.parse(this.response);
//   console.log(data)
// }


// xhr.send();
