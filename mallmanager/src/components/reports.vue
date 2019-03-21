<template>
    <div class="wrap">
        <!-- 面包屑 -->
        <breadcrumb level1="数据统计" level2="数据报表"></breadcrumb>
        <!-- 提供容器 -->
        <!-- 注意:记得给容器设置宽高,否则不显示图表 -->
        <div id="reportsWrap" style="width: 600px;height:400px;">
        </div>
        <!-- 评价占比容器 -->
        <div id="evaluateProportion" style="width:600px; height:400px"></div>
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        data() {
            return {
                // 评价统计
                evaluateStatistics: {
                    countpraise: 130, //累计好评条数
                    countcomment: 210, //累计中评条数
                    countbad: 102, //累计差评条数
                    countstatistics: 442, //累计评价条数
                    todaypraise: 10, //今日好评条数
                    todaycomment: 53, //今日中评条数
                    todaybad: 4, //今日差评条数
                    todaystatistics: 67 //今日评价条数
                },
                // 评价占比
                evaluateProportion: {
                    // legenddata:,
                    seriesdata: [{
                        name: "美团",
                        Proportion: 30
                    }, {
                        name: "微信小程序",
                        Proportion: 20
                    }, {
                        name: "支付宝小程序",
                        Proportion: 15
                    }, {
                        name: "大屏自助",
                        Proportion: 25
                    }, {
                        name: "收银机",
                        Proportion: 10
                    }]
                },
                // 菜品评价
                evaluateGoods: [{
                        "praisenum": "20",
                        "badnum": "6",
                        "goodsid": 1,
                        "goodsname": "酱牛肉0酱牛肉0"
                    },
                    {
                        "praisenum": "10",
                        "badnum": "3",
                        "goodsid": 3,
                        "goodsname": "土豆饼"
                    },
                    {
                        "praisenum": "8",
                        "badnum": "2",
                        "goodsid": 2,
                        "goodsname": "猪肉大葱饺子"
                    }
                ],
                // 门店评价
                evaluateStore: [{
                        "praisenum": "80",
                        "commentnum": "64",
                        "badnum": "32",
                        "storeid": 1,
                        "count": 176,
                        "praiserate": 0.45,
                        "badrate": 0.18,
                        "storename": "生命科学园永旺店3"
                    },
                    {
                        "praisenum": "28", //好评条数
                        "commentnum": "12", //中评条数
                        "badnum": "4", //差评条数
                        "storeid": 2, //门店id
                        "count": 44, //总评条数
                        "praiserate": 0.64, //好评率
                        "badrate": 0.09, //差评率
                        "storename": "小艾测试" //门店名称
                    }
                ]
            }
        },
        mounted() {
            this.initEcharts()
            this.fnevaluateProportion()
        },
        methods: {
            // 评价占比(饼状图)
            fnevaluateProportion() {
                const myChart = echarts.init(document.getElementById('evaluateProportion'))
                let seriesData = []
                let legendData = []
                this.evaluateProportion.seriesdata.forEach((item, index) => {
                    seriesData.push({
                        name: item.name,
                        value: item.Proportion
                    })
                    legendData.push(item.name)
                })
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}%"
                    },
                    legend: {
                        data: legendData,
                        bottom:'bottom'
                    },
                    series: [{
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        selectedMode: 'single',
                        data: seriesData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                myChart.setOption(option)
            },
            async initEcharts() {
                // 基于准备好的dom,初始化echarts实例
                const myChart = echarts.init(document.getElementById('reportsWrap'))
                // 指定图表的配置项和数据
                const res = await this.$http.get(`reports/type/1`);
                const data = res.data.data;
                // console.log(data);

                const option1 = {
                    title: {
                        text: '线性图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                }
                const echart1 = { ...option1,
                    ...data
                }
                // 使用指定的配置项和数据显示图表
                myChart.setOption(echart1);
            },
        }
    }
</script>

<style scoped>
</style>
