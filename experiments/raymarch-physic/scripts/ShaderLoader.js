'use strict';

let THREE = window.THREE;

export default class {
  constructor (vertexShaderurl, fragmentShaderUrl) {
    let loadShaderFile = (url) => {
      return new Promise((resolve, reject) => {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onload = () => {
          resolve(xmlHttpRequest.response);
        };
        xmlHttpRequest.open('get', url, true);
        xmlHttpRequest.send();
      });
    };

    loadShaderFile(vertexShaderurl).then((data) => {
      console.log(data);
    });
    // function timeout(duration = 0) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(resolve, duration);
    //   })
    // }
    //
    //
    //
    // var p = timeout(1000).then(() => {
    //   return timeout(2000);
    // }).then(() => {
    //   throw new Error("hmm");
    // }).catch(err => {
    //   return Promise.all([timeout(100), timeout(200)]);
    // })
  }
}
