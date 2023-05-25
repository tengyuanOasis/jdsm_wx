<template>
    <view class="card evaluation">
        <view class="card-header">
            <view class="card-header-title">用户评价</view>
            <icon type="RightOutline" className="more-icon" onTap="toCommonProblem" />
        </view>
        <swiper
            style="height: 400px"
            previousMargin="10px"
            nextMargin="10px"
            :indicatorDots="false"
            :autoplay="true"
            :vertical="true"
            :interval="true"
            :circular="true"
            duration="2000"
        >
            <swiper-item :key="index" v-for="(evaluation, index) in evaluationList">
                <list-item imageSize="x-small" :brief="item.evaluation" v-for="(item, index1) in evaluation" :key="index1">
                    <view class="swiper-item-header">
                        <view class="swiper-item-header-spuName">{{ item.spuName }}</view>
                        <view class="swiper-item-header-price">¥{{ item.sellPrice }}</view>
                    </view>

                    <avatar slot="image" :name="item.spuName + '}'" :desc="item.evaluation" />

                    <!-- src="https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" -->
                </list-item>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
const evaluation = require('../../constant/evaluation.json');
export default {
    data() {
        return {
            evaluationList: evaluation,
            evaluation: []
        };
    },
    methods: {
        toCommonProblem: function () {
            wx2my.navigateTo({
                url: '/pages/questionguide/questionguide'
            });
        }
    },
    created: function () {}
};
</script>
<style lang="scss">
@import './evaluation.scss';
</style>
