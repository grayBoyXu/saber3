<template>
  <div>
    <el-dialog
      v-if="isDialog"
      v-model="visible"
      append-to-body
      destroy-on-close
      title="流程图展示"
      width="70%"
      class="flow-design-dialog"
    >
      <nf-design-base ref="bpmn" style="height: 60vh" :options="option"></nf-design-base>
    </el-dialog>
    <div v-else>
      <nf-design-base
        v-if="visible"
        ref="bpmn"
        style="height: 60vh"
        :options="option"
      ></nf-design-base>
    </div>
  </div>
</template>

<script>
import { modelView } from '@/api/flow/flow';

export default {
  name: 'flowDesign',
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    isDisplay: {
      type: Boolean,
      default: false,
    },
    processInstanceId: String,
    processDefinitionId: String,
  },
  data() {
    return {
      visible: false,
      option: {
        mode: 'view',
      },
    };
  },
  watch: {
    isDisplay: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
    visible: {
      handler(val) {
        this.$emit('update:is-display', val);
      },
    },
    processInstanceId: {
      handler(val) {
        if (!val) return;
        this.getDetail({ processInstanceId: this.processInstanceId });
      },
      immediate: true,
    },
    processDefinitionId: {
      handler(val) {
        if (!val) return;
        this.getDetail({ processDefinitionId: this.processDefinitionId });
      },
      immediate: true,
    },
  },
  methods: {
    getDetail(params) {
      modelView(params).then(res => {
        const data = res.data.data;
        const { xml, flow } = data;
        this.option.xml = xml;
        if (flow) {
          const flows = [];
          flow.forEach(f => {
            let { endTime } = f;

            const ff = {
              id: f.historyActivityId,
              class: !endTime && f.historyActivityType !== 'candidate' ? 'nodePrimary' : '',
            };

            if (f.historyActivityType === 'sequenceFlow') ff.class = 'lineWarn';
            else if (!ff.class && f.historyActivityType !== 'candidate') ff.class = 'nodeSuccess';

            const index = flows.findIndex(fl => fl.id === f.historyActivityId);
            if (index !== -1) flows.splice(index, 1, ff);
            else flows.push(ff);
          });
          this.option.flows = flows;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.flow-design-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);

  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}
</style>
