import App from './App';

// 全局mixins，用于实现setData等功能，请勿删除！';
import zpMixins from '@/uni_modules/zp-mixins/index.js';

import Vue from 'vue';

Vue.use(zpMixins);

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App
});
app.$mount();
