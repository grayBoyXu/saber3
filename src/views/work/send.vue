<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      v-model:page="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu="scope">
        <el-button
          type="primary"
          text
          icon="el-icon-view"
          v-if="permission.work_send_detail"
          @click.stop="handleDetail(scope.row)"
          >详情
        </el-button>
        <el-button
          type="primary"
          text
          icon="el-icon-search"
          v-if="permission.work_send_follow"
          @click.stop="handleImage(scope.row, scope.index)"
          >流程图
        </el-button>
      </template>
      <template #processDefinitionVersion="{ row }">
        <el-tag>v{{ row.processDefinitionVersion }}</el-tag>
      </template>
      <template #processIsFinished="{ row }">
        <el-tag>{{ row.processIsFinished === 'finished' ? '已完成' : '未完成' }}</el-tag>
      </template>
    </avue-crud>
    <flow-design
      v-if="this.website.designMode"
      is-dialog
      v-model:is-display="flowBox"
      :process-instance-id="processInstanceId"
    ></flow-design>
    <el-dialog v-else title="流程图" append-to-body v-model="flowBox" :fullscreen="true">
      <iframe
        :src="flowUrl"
        width="100%"
        height="700"
        title="流程图"
        frameBorder="no"
        border="0"
        marginWidth="0"
        marginHeight="0"
        scrolling="no"
        allowTransparency="yes"
      >
      </iframe>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="flowBox = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { sendList } from '@/api/work/work';
import { flowCategory, flowRoute } from '@/utils/flow';

export default {
  data() {
    return {
      form: {},
      selectionId: '',
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      processInstanceId: '',
      flowBox: false,
      flowUrl: '',
      workBox: false,
      option: {
        height: 'auto',
        calcHeight: 32,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        editBtn: false,
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        dialogWidth: 900,
        menuWidth: 200,
        dialogClickModal: false,
        column: [
          {
            label: '流程分类',
            type: 'select',
            row: true,
            dicUrl: '/blade-system/dict/dictionary?code=flow',
            props: {
              label: 'dictValue',
              value: 'dictKey',
            },
            dataType: 'number',
            slot: true,
            prop: 'category',
            search: true,
            hide: true,
            width: 85,
          },
          {
            label: '流程名称',
            prop: 'processDefinitionName',
            search: true,
          },
          {
            label: '当前步骤',
            prop: 'taskName',
          },
          {
            label: '流程版本',
            prop: 'processDefinitionVersion',
            slot: true,
            width: 85,
          },
          {
            label: '流程进度',
            prop: 'processIsFinished',
            slot: true,
            width: 85,
          },
          {
            label: '申请时间',
            prop: 'createTime',
            width: 180,
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(['permission', 'flowRoutes']),
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
  },
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    handleDetail(row) {
      this.$router.push({
        path: `/work/process/${flowRoute(this.flowRoutes, row.category)}/detail/${
          row.processInstanceId
        }/${row.businessId}`,
      });
    },
    handleImage(row) {
      if (this.website.designMode) {
        this.processInstanceId = row.processInstanceId;
      } else {
        this.flowUrl = `/api/blade-flow/process/diagram-view?processInstanceId=${row.processInstanceId}`;
      }
      this.flowBox = true;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const query = {
        ...this.query,
        category: params.category ? flowCategory(params.category) : null,
      };
      this.loading = true;
      sendList(page.currentPage, page.pageSize, Object.assign(params, query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
  },
};
</script>
