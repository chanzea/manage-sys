<template>
  <div class="page-task-monitor">
    <div style="padding: 20px 0 0;border: 10px white solid">
      <div ref="realTimeMonitor" style="height: 300px "></div>
    </div>
    <div style="padding: 20px 0;border: 10px white solid">
      <DatePicker
        style="margin-left: 15px;width: 200px"
        class="form-item"
        type="daterange"
        @on-change="handleDateRangeChange"
        placeholder="选择查询时间范围"
        v-model="value"
      ></DatePicker>
      <div ref="costHistoryMonitor" style="height: 500px " ></div>
    </div>
    <div style="padding: 20px 0;border: 10px white solid">
      <DatePicker
        style="margin-left: 15px;width: 200px"
        class="form-item"
        type="daterange"
        @on-change="handleAmountDateRangeChange"
        placeholder="选择查询时间范围"
        v-model="value2"
      ></DatePicker>
      <div ref="amountHistoryMonitor" style="height: 500px " ></div>
    </div>
  </div>
</template>
<script>
import { getRealTimeMonitor, getHistoryMonitor } from "@/api/task";

export default {
  name: "TaskMonitor",
  data() {
    return {
      legendData: [],
      seriesData: [],
      value: [],
      value2: [],
      realTimeMonitorEcharts: null,
      historyMonitorEcharts: null,
      realMonitorOptions: {
        title: {
          text: "实时监控数据",
          subtext: "用户任务实时数据",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "30%",
          data: [] //"直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              // { value: 335, name: "直接访问" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      costHistoryMonitorOption: {
        title: {
          text: "历史监控数据",
          subtext: "每个月的各个指标统计图",
          x: "85%",
          // y: "10%"
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["month", "2015", "2016", "2017"],
          source: [
            {
              month: "Matcha Latte",
              "2015": 43.3,
              "2016": 85.8,
              "2017": 93.7
            },
            { product: "Milk Tea", "2015": 83.1, "2016": 73.4, "2017": 55.1 },
            {
              month: "Cheese Cocoa",
              "2015": 86.4,
              "2016": 65.2,
              "2017": 82.5
            },
            {
              month: "Walnut Brownie",
              "2015": 72.4,
              "2016": 53.9,
              "2017": 39.1
            }
          ]
        },
        xAxis: { type: "category" },
        yAxis: {
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      },
      amountHistoryMonitorOption: {
        title: {
          text: "历史监控数据",
          subtext: "每个月的各个指标统计图",
          x: "85%",
          // y: "10%"
        },
        legend: {},
        tooltip: {},
        dataset: {
          // center: ["50%", "10%"],
          dimensions: ["month", "2015", "2016", "2017"],
          source: [
            {
              month: "Matcha Latte",
              "2015": 43.3,
              "2016": 85.8,
              "2017": 93.7
            },
            { product: "Milk Tea", "2015": 83.1, "2016": 73.4, "2017": 55.1 },
            {
              month: "Cheese Cocoa",
              "2015": 86.4,
              "2016": 65.2,
              "2017": 82.5
            },
            {
              month: "Walnut Brownie",
              "2015": 72.4,
              "2016": 53.9,
              "2017": 39.1
            }
          ]
        },
        xAxis: { type: "category" },
        yAxis: {
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      }
    };
    
  },
  mounted() {
    
    this.realTimeMonitorEcharts = this.$echarts.init(
      this.$refs.realTimeMonitor
    );
    this.getRealTimeMonitor();
    // this.realTimeMonitorEcharts.setOption(this.realMonitorOptions);
    this.costHistoryMonitorEcharts = this.$echarts.init(
      this.$refs.costHistoryMonitor
    );
    // this.getTaskItemHandleCostMonitor();
    this.costHistoryMonitorEcharts.setOption(this.costHistoryMonitorOption)

    this.amountHistoryMonitorEcharts = this.$echarts.init(
      this.$refs.amountHistoryMonitor
    );
    this.amountHistoryMonitorEcharts.setOption(this.amountHistoryMonitorOption)
    // this.getTaskItemMonitor();
  },

  watch: {
    realMonitorOptions: {
      handler: function(newVal, oldVal) {
        console.log(newVal, oldVal);
      },
      deep: true
    }
  },

  updated() {},

  methods: {
    getRealTimeMonitor: function() {
      getRealTimeMonitor({}).then(res => {
        let { realTimeMonitor } = res;
        let legendDatalegendData = realTimeMonitor.map(item => item.name);
        this.realMonitorOptions.legend.data = legendDatalegendData;
        this.realMonitorOptions.series[0].data = realTimeMonitor;
        this.realTimeMonitorEcharts.setOption(this.realMonitorOptions);
      });
    },

    getTaskItemHandleCostMonitor() {
      this.getHistoryMonitor("cost", (data) => {
        let {dimensions,source} = data.taskItemMonitor
        this.amountHistoryMonitorOption.dataset.dimensions = dimensions;
        this.amountHistoryMonitorOption.dataset.source = source;
        this.amountHistoryMonitorEcharts.setOption(this.amountHistoryMonitorOption);
      })
    },


    getTaskItemMonitor() {
      this.getHistoryMonitor("amount", (data) => {
        let {dimensions,source} = data.taskItemHandleCostMonitor
        this.costHistoryMonitorOption.dataset.dimensions = dimensions;
        this.costHistoryMonitorOption.dataset.source = source;
        this.costHistoryMonitorEcharts.setOption(this.costHistoryMonitorOption);
      })
    },

    //获取历史监控
    getHistoryMonitor(tag, callback) {

      let {startTime, endTime} = tag == 'cost' ? this.value : this.value2;

      let params = {
        startTime: this.value[0],
        endTime: this.value[1],
        tag
      }
      getHistoryMonitor(params).then(res => {
          callback && callback(res);
      });
    },

    handleDateRangeChange(value) {
      this.value = value;
      this.getTaskItemHandleCostMonitor();
    },

    handleAmountDateRangeChange(value){
      this.value2 = value;
      this.getTaskItemMonitor();
    }

  }
};
</script>

<style lang="scss" scoped>
.page-task-monitor {
}
</style>