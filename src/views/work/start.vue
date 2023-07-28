<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      v-model:page="page"
      v-model="form"
      ref="crud"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu-left>
        <el-radio-group v-model="mode">
          <el-radio-button label="1">通用流程</el-radio-button>
          <el-radio-button label="2">定制流程</el-radio-button>
        </el-radio-group>
      </template>
      <template #menu="scope">
        <el-button
          type="primary"
          text
          icon="el-icon-video-play"
          v-if="permission.work_start_flow"
          @click.stop="handleStart(scope.row)"
          >发起
        </el-button>
        <el-button
          type="primary"
          text
          icon="el-icon-search"
          v-if="permission.work_start_image"
          @click.stop="handleImage(scope.row, scope.index)"
          >流程图
        </el-button>
      </template>
      <template #tenantId="{ row }">
        <el-tag>{{ row.tenantId === '' ? '通用' : row.tenantId }}</el-tag>
      </template>
      <template #version="{ row }">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
      <template #suspensionState="{ row }">
        <el-tag>{{ row.suspensionState === 1 ? '激活' : '挂起' }}</el-tag>
      </template>
      <template #category="{ row }">
        <el-tag>{{ row.categoryName }}</el-tag>
      </template>
    </avue-crud>
    <flow-design
      v-if="this.website.designMode"
      is-dialog
      v-model:is-display="flowBox"
      :process-definition-id="processDefinitionId"
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
import { startList } from '@/api/work/work';
import { flowCategory, flowRoute } from '@/utils/flow';

export default {
  data() {
    return {
      form: {},
      mode: '1',
      selectionId: '',
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      processDefinitionId: '',
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
        menuWidth: 200,
        dialogWidth: 900,
        dialogClickModal: false,
        column: [
          {
            label: '租户编号',
            prop: 'tenantId',
            slot: true,
            width: 120,
          },
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
            width: 100,
          },
          {
            label: '流程标识',
            prop: 'key',
          },
          {
            label: '流程名称',
            prop: 'name',
            search: true,
          },
          {
            label: '流程版本',
            prop: 'version',
            slot: true,
            width: 85,
          },
          {
            label: '状态',
            prop: 'suspensionState',
            slot: true,
            width: 80,
          },
          {
            label: '部署时间',
            prop: 'deploymentTime',
            width: 170,
          },
        ],
      },
      data: [],
    };
  },
  watch: {
    mode() {
      this.onLoad(this.page);
    },
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
    handleStart(row) {
      this.$router.push({
        path: `/work/process/${flowRoute(this.flowRoutes, row.category)}/form/${row.id}`,
      });
    },
    handleImage(row) {
      if (this.website.designMode) {
        this.processDefinitionId = row.id;
      } else {
        this.flowUrl = `/api/blade-flow/process/resource-view?processDefinitionId=${row.id}`;
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
        mode: this.mode,
      };
      this.loading = true;
      startList(page.currentPage, page.pageSize, Object.assign(params, query)).then(res => {
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
