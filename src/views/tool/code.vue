<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      v-model:page="page"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template #menu-left>
        <el-button
          type="danger"
          icon="el-icon-delete"
          v-if="permission.code_delete"
          plain
          @click="handleDelete"
          >删 除
        </el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleBuild"
          >代码生成
        </el-button>
      </template>
      <template #menu="scope">
        <el-button
          type="primary"
          text
          icon="el-icon-document-copy"
          v-if="permission.code_edit"
          class="none-border"
          @click.stop="handleCopy(scope.row)"
          >复制
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getCode, build, remove, add, update, copy } from '@/api/tool/code';
import { getDetail as modelDetail, prototypeDetail } from '@/api/tool/model';
import { templateDic } from '@/const/tool/model';
import { validatenull } from '@/utils/validate';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {},
      selectionList: [],
      loading: true,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        height: 'auto',
        calcHeight: 32,
        dialogWidth: 900,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        labelWidth: 120,
        menuWidth: 300,
        viewBtn: true,
        dialogClickModal: false,
        tabs: true,
        column: [
          {
            label: '模块名',
            prop: 'codeName',
            search: true,
            display: false,
          },
          {
            label: '模版类型',
            prop: 'templateType',
            type: 'select',
            dicData: templateDic,
            display: false,
          },
          {
            label: '表名',
            prop: 'tableName',
            search: true,
            display: false,
          },
          {
            label: '服务名',
            prop: 'serviceName',
            search: true,
            display: false,
          },
          {
            label: '包名',
            prop: 'packageName',
            display: false,
          },
        ],
        group: [
          {
            label: '模型配置',
            prop: 'modelSetting',
            icon: 'el-icon-tickets',
            column: [
              {
                label: '数据模型',
                prop: 'modelId',
                search: true,
                span: 24,
                type: 'select',
                dicUrl: '/blade-develop/model/select',
                props: {
                  label: 'modelName',
                  value: 'id',
                },
                rules: [
                  {
                    required: true,
                    message: '请选择数据模型',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '模块名',
                prop: 'codeName',
                search: true,
                rules: [
                  {
                    required: true,
                    message: '请输入模块名',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '服务名',
                prop: 'serviceName',
                search: true,
                rules: [
                  {
                    required: true,
                    message: '请输入服务名',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '表名',
                prop: 'tableName',
                rules: [
                  {
                    required: true,
                    message: '请输入表名',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '表前缀',
                prop: 'tablePrefix',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请输入表前缀',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '主键名',
                prop: 'pkName',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请输入主键名',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '包名',
                prop: 'packageName',
                overHidden: true,
                rules: [
                  {
                    required: true,
                    message: '请输入包名',
                    trigger: 'blur',
                  },
                ],
              },
            ],
          },
          {
            label: '模版配置',
            prop: 'templateSetting',
            icon: 'el-icon-copy-document',
            column: [
              {
                label: '模版类型',
                prop: 'templateType',
                type: 'select',
                dicData: templateDic,
                value: 'crud',
                rules: [
                  {
                    required: true,
                    message: '请选择模版类型',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '作者信息',
                prop: 'author',
                value: 'BladeX',
                rules: [
                  {
                    required: true,
                    message: '请输入作者',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '子表模型',
                prop: 'subModelId',
                type: 'select',
                dicUrl: '/blade-develop/model/select',
                props: {
                  label: 'modelName',
                  value: 'id',
                },
                display: false,
                hide: true,
              },
              {
                label: '子表外键',
                prop: 'subFkId',
                display: false,
                hide: true,
              },
              {
                label: '树主键字段',
                prop: 'treeId',
                type: 'select',
                dicData: [],
                props: {
                  label: 'jdbcComment',
                  value: 'jdbcName',
                },
                display: false,
                hide: true,
              },
              {
                label: '树父主键字段',
                prop: 'treePid',
                type: 'select',
                dicData: [],
                props: {
                  label: 'jdbcComment',
                  value: 'jdbcName',
                },
                display: false,
                hide: true,
              },
              {
                label: '树名称字段',
                prop: 'treeName',
                type: 'select',
                dicData: [],
                props: {
                  label: 'jdbcComment',
                  value: 'jdbcName',
                },
                display: false,
                hide: true,
              },
            ],
          },
          {
            label: '生成配置',
            prop: 'codingSetting',
            icon: 'el-icon-printer',
            column: [
              {
                label: '基础业务',
                labelTip: '配置是否使用BladeX封装的BaseService解锁更多功能',
                prop: 'baseMode',
                type: 'radio',
                dicUrl: '/blade-system/dict/dictionary?code=yes_no',
                props: {
                  label: 'dictValue',
                  value: 'dictKey',
                },
                value: 2,
                dataType: 'number',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请选择基础业务',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '包装器',
                labelTip: '配置是否使用Wrapper包装器来拓展Controller返回列表的字段',
                prop: 'wrapMode',
                type: 'radio',
                dicUrl: '/blade-system/dict/dictionary?code=yes_no',
                props: {
                  label: 'dictValue',
                  value: 'dictKey',
                },
                value: 2,
                dataType: 'number',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请选择包装器',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '远程调用',
                labelTip: '配置是否使用Feign远程调用',
                prop: 'feignMode',
                type: 'radio',
                dicUrl: '/blade-system/dict/dictionary?code=yes_no',
                props: {
                  label: 'dictValue',
                  value: 'dictKey',
                },
                value: 1,
                dataType: 'number',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请选择基础业务',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '代码风格',
                labelTip: '选择不同底层实现的代码模版',
                prop: 'codeStyle',
                type: 'radio',
                dicData: [
                  {
                    label: 'saber3',
                    value: 'saber3',
                  },
                  {
                    label: 'element-plus',
                    value: 'element-plus',
                  },
                ],
                value: 'saber3',
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请选择代码风格',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '后端生成路径',
                prop: 'apiPath',
                span: 24,
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请输入后端生成路径',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '前端生成路径',
                prop: 'webPath',
                span: 24,
                hide: true,
                rules: [
                  {
                    required: true,
                    message: '请输入前端生成路径',
                    trigger: 'blur',
                  },
                ],
              },
            ],
          },
        ],
      },
      data: [],
    };
  },
  watch: {
    'form.modelId'() {
      if (!validatenull(this.form.modelId)) {
        // 获取数据模型信息
        modelDetail(this.form.modelId).then(res => {
          const result = res.data;
          if (result.success) {
            const { modelName, modelTable, modelCode } = result.data;
            if (validatenull(this.form.tablePrefix)) {
              this.form.tablePrefix = modelTable.split('_')[0] + '_';
            }
            if (validatenull(this.form.tableName)) {
              this.form.tableName = modelTable;
            }
            if (validatenull(this.form.codeName)) {
              this.form.codeName = modelName;
            }
            if (validatenull(this.form.serviceName)) {
              this.form.serviceName = `blade-${modelCode}`;
            }
            if (validatenull(this.form.pkName)) {
              this.form.pkName = 'id';
            }
            if (validatenull(this.form.packageName)) {
              this.form.packageName = `org.springblade.${modelCode}`;
            }
            if (validatenull(this.form.subFkId) && !validatenull(this.form.tablePrefix)) {
              this.form.subFkId = modelTable.replace(this.form.tablePrefix, '') + '_id';
            }

            // 获取数据原型信息
            prototypeDetail(this.form.modelId).then(res => {
              const result = res.data;
              if (result.success) {
                const columnTreeId = this.findObject(this.option.group, 'treeId');
                const columnTreePid = this.findObject(this.option.group, 'treePid');
                const columnTreeName = this.findObject(this.option.group, 'treeName');
                columnTreeId.dicData = result.data;
                columnTreePid.dicData = result.data;
                columnTreeName.dicData = result.data;
              }
            });
          }
        });
      }
    },
    'form.templateType'() {
      // 模版类型
      const type = this.form.templateType;

      // 主子表字段显隐
      const columnSubModelId = this.findObject(this.option.group, 'subModelId');
      const columnSubFkId = this.findObject(this.option.group, 'subFkId');
      columnSubModelId.display = type === 'sub';
      columnSubFkId.display = type === 'sub';

      // 树表字段显隐
      const columnTreeId = this.findObject(this.option.group, 'treeId');
      const columnTreePid = this.findObject(this.option.group, 'treePid');
      const columnTreeName = this.findObject(this.option.group, 'treeName');
      columnTreeId.display = type === 'tree';
      columnTreePid.display = type === 'tree';
      columnTreeName.display = type === 'tree';
    },
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.validData(this.permission.code_add, false),
        viewBtn: this.validData(this.permission.code_view, false),
        delBtn: this.validData(this.permission.code_delete, false),
        editBtn: this.validData(this.permission.code_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
  },
  methods: {
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
    },
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
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.$refs.crud.toggleSelection();
        });
    },
    handleBuild() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('是否生成选中模块的代码?', {
        title: '代码生成确认',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        return build(this.ids).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.$refs.crud.toggleSelection();
        });
      });
    },
    handleCopy(row) {
      copy(row.id).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '复制成功!',
        });
      });
    },
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getCode(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
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
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
