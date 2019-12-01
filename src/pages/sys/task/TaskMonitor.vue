<template>
  <div class="page-task-monitor">
    <div ref="realTimeMonitor" style="height: 300px "></div>
  </div>
</template>
<script>
import { getRealTimeMonitor } from "@/api/task";

export default {
  name: "TaskMonitor",
  data() {
    return {
      legendData: [],
      seriesData: [],
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
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
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
      }
    };
  },
  mounted() {
    this.getRealTimeMonitor();
    var myChart = this.$echarts.init(this.$refs.realTimeMonitor);
    myChart.setOption(this.realMonitorOptions);
  },

  watch: {
    realMonitorOptions: {
      handler: function(newVal, oldVal){
        console.log(newVal,oldVal);
        
      },
      deep: true
    }
  },

  updated() {

  },

  methods: {
    getRealTimeMonitor: function() {
      getRealTimeMonitor({}).then( (res) => {
        console.log(res);
        let {realTimeMonitor} = res;
        legendDatalegendData = realTimeMonitor.map( item => {
          item.name
        })

        this.realMonitorOptions.legend.data = legendDatalegendData;
        this.realMonitorOptions.series.data = realTimeMonitor;

      })
    }
  }
};
</script>

<style lang="scss" scoped>
.page-task-monitor {
}
</style>