/** @format */
class tips {
	//200成功时候的提示
	static SUCCESS_200(msg = '成功的请求！') {
		return uni.showToast({
			title: msg,
			icon: 'success',
			duration: 2000,
			mask: true
		});
	} //通用的异常处理

	static ERROR_COMMON(msg = '网络跑丢啦！') {
		return uni.showToast({
			title: msg,
			icon: 'error',
			duration: 2000,
			mask: true
		});
	} //500000错误码弹框

	static ERROR_500000(msg = '请求异常') {
		return uni.showToast({
			title: msg,
			icon: 'error',
			duration: 2000,
			mask: true
		});
	} //500网络跑丢啦状态码

	static ERROR_500(msg = '网络跑丢啦！') {
		return uni.showToast({
			title: msg,
			icon: 'error',
			duration: 2000,
			mask: true
		});
	}
	static ERROR_401(msg = '授权失败！') {
		return uni.showToast({
			title: msg,
			icon: 'error',
			duration: 2000,
			mask: true
		});
	}

	static LOADING(msg = '加载中...') {
		return uni.showLoading({
			title: msg,
			mask: true
		});
	}

	static MODAL(title, content, successF) {
		uni.showModal({
			title: title,
			content: content,
			success(res) {
				if (res.confirm) {
					if (successF) {
						successF();
					}
				}
			}
		});
	}
}
export { tips };
