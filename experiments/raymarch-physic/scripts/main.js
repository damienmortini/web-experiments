'use strict';

import ThreejsView from './threejs-view';

class Main {
  constructor() {
    var view = new ThreejsView(document.querySelector('canvas'));
  }
}

new Main();
