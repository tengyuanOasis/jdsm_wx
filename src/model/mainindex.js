/** @format */

import { commonDomain as domain } from '../constant/common';
import { HTTP } from '../utils/http-promise';
class MainIndexModel extends HTTP {
	//promise请求逻辑
	//获取热门品牌
	getHotBrand() {
		return this.request({
			url: `${domain.apiHost}/page/getIndexRecommendBrand`,
			method: 'GET',
			data: {}
		});
	} //获取热门机型

	getHotVersion() {
		return this.request({
			url: `${domain.apiHost}/page/hotMobile`,
			method: 'POST',
			data: {}
		});
	} //获取三张晒单内容

	getThreePhoto() {
		return this.request({
			url: `${domain.apiHost}/getThreeShowPhotos`,
			method: 'GET',
			data: {}
		});
	} //获取所有晒单内容

	getAllPhotos(page, limit) {
		return this.request({
			url: `${domain.apiHost}/getShowPhotosByPage?page=${page}&limit=${limit}`,
			headers: {
				'content-type': 'application/json'
			},
			method: 'GET'
		});
	}
}
export { MainIndexModel };
