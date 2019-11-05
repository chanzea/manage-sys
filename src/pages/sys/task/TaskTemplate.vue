<template>
  <div class="page-task-template">
    <div class="task-template-content">
      <Tabs :value="currentTab">
        <TabPane v-for="(item, index) in tabLists" :key="index" :label="item.label" :name="item.name">
          <div class="content-middle">
            <div class="content-middle-item">
              <span class="content-middle-item-label">模版编号</span>
              <span class="content-middle-item-value">MB001</span>
            </div>
            <div class="content-middle-item">
              <span class="content-middle-item-label">模版名称</span>
              <span class="content-middle-item-value">分类模版</span>
            </div>
            <div class="content-middle-item">
              <span class="content-middle-item-label">任务示例</span>
              <div class="content-middle-item-pic">
                <div class="content-middle-item-pic-detail">
                  <span class="content-middle-item-pic-detail-label">原图</span>
                  <span class="content-middle-item-pic-detail-img">
                    <img :src="src" alt="">
                  </span>
                </div>
                <span style="margin: 24px;font-size: 40px;">
                  <Icon type="md-arrow-forward" />
                </span>
                <div class="content-middle-item-pic-detail">
                  <span class="content-middle-item-pic-detail-label">标注后</span>
                  <span class="content-middle-item-pic-detail-img">
                    <img :src="src" alt="">
                  </span>
                </div>
              </div>
            </div>
            <div class="content-middle-item">
              <span class="content-middle-item-label">任务描述</span>
              <span class="content-middle-item-value">任务说明</span>
            </div>
            <div class="content-middle-item">
              <span class="content-middle-item-label">评分标准</span>
              <span class="content-middle-item-value">人形全部在表框内，边界距离表框小于0.5CM</span>
            </div>
            <div class="content-middle-item">
              <span class="content-middle-item-label">答题版</span>
              <span class="content-middle-item-img">
                <img :src="src" alt="">
              </span>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskTemplate',
  data () {
    return {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAABlBMVEWsrKz///95bZpiAAAAn0lEQVR42u3SsQnCUBSG0ac8iaUjZATBBYJYOJRgFItnpRvoJmYAh8gIlhaCxhEuac/pP3643AQAAAAAAAAAAABjVN+2zmkTSXIqQ7IOJU082ZW6et+6SHK6fHJqU8BsW1KetJEmL4dkeg0lz5L2fSipVpdXU5fQyrwsmvocOnIXT5b/5BBK5tfFvj/G3vI+rDz6BAAAAAAAAAAAACP8AHF0IIXHt9C2AAAAAElFTkSuQmCC',
      tabLists: [{
        label: '分类模版',
        name: 'classify'
      },{
        label: '标框模版',
        name: 'standard'
      },{
        label: '分割模版',
        name: 'split'
      },{
        label: '图片剔除模版',
        name: 'picReject'
      },{
        label: '文件剔除模版',
        name: 'fileReject'
      },],
      currentTab: 'classify'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-task-template {
  .task-template-content {
    .content-middle {
      display: flex;
      flex-direction: column;
      &-item {
        display: flex;
        color: #515a6e;
        padding: 20px;
        &-label {
          width: 90px;
          text-align: right;
          font-size: 12px;
          margin-right: 24px;
        }
        &-value {
          flex: 1;
        }
        &-pic {
          flex: 1;
          display: flex;
          &-detail {
            display: flex;
            flex-direction: column;
            justify-content: center;
            &-label {
              margin-bottom: 12px;
              text-align: center;
            }
            &-img {
              width: 200px;
              height: 200px;
              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>