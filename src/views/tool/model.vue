<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      v-loading.fullscreen.lock="fullscreenLoading"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template #menu-left>
        <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete"
          >删 除
        </el-button>
      </template>
      <template #menu="{ row }">
        <el-button
          type="primary"
          text
          icon="el-icon-setting"
          plain
          class="none-border"
          @click.stop="handleModel(row)"
          >模型配置
        </el-button>
      </template>
      <template #modelTable="{ row }">
        <el-tag>{{ row.modelTable }}</el-tag>
      </template>
    </avue-crud>
    <el-dialog title="数据库模型配置" v-model="modelBox" :fullscreen="true" append-to-body>
      <avue-crud
        ref="crudModel"
        :option="optionModel"
        :table-loading="loading"
        :data="fields"
      ></avue-crud>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="modelBox = false">关 闭</el-button>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </span>
      </template>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  getTableList,
  getTableInfoByName,
  getModelPrototype,
  submitModelPrototype,
} from '@/api/tool/model';
import { entityDic, option, optionModel } from '@/const/tool/model';
import { validatenull } from '@/utils/validate';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      loadingOption: {
        lock: true,
        text: '物理表读取中',
        background: 'rgba(0, 0, 0, 0.7)',
      },
      fullscreenLoading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      modelBox: false,
      modelId: 0,
      datasourceId: 1,
      tableInfo: {},
      active: 0,
      stepStart: 0,
      stepEnd: 4,
      data: [],
      option: option,
      optionModel: optionModel,
      formStep: {},
      fields: [],
      selectionModelList: [],
      // 默认不需要显示的字段名
      hideFields: [
        'id',
        'tenant_id',
        'create_user',
        'create_dept',
        'create_time',
        'update_user',
        'update_time',
        'status',
        'is_deleted',
      ],
    };
  },
  watch: {
    'form.datasourceId'() {
      if (!validatenull(this.form.datasourceId)) {
        const fullLoading = this.$loading(this.loadingOption);
        getTableList(this.form.datasourceId)
          .then(res => {
            const column = this.findObject(this.option.column, 'modelTable');
            column.dicData = res.data.data;
            fullLoading.close();
          })
          .catch(() => {
            fullLoading.close();
          });
      }
    },
    'form.modelTable'() {
      if (!validatenull(this.form.modelTable)) {
        const fullLoading = this.$loading(this.loadingOption);
        getTableInfoByName(this.form.modelTable, this.form.datasourceId)
          .then(res => {
            const result = res.data;
            if (result.success) {
              const { comment, entityName } = result.data;
              if (validatenull(this.form.modelClass)) {
                this.form.modelClass = entityName;
              }
              if (validatenull(this.form.modelName)) {
                this.form.modelName = comment;
              }
              if (validatenull(this.form.modelCode)) {
                this.form.modelCode = entityName.replace(/^\S/, s => s.toLowerCase());
              }
              fullLoading.close();
            }
          })
          .catch(() => {
            fullLoading.close();
          });
      }
    },
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: true,
        delBtn: true,
        editBtn: true,
        viewBtn: false,
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
        res => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.$confirm('是否进行模型配置?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            let model = {
              id: res.data.data.id,
              datasourceId: res.data.data.datasourceId,
            };
            this.handleModel(model);
          });
        },
        error => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        },
        error => {
          loading();
          window.console.log(error);
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
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionModelChange(list) {
      this.selectionModelList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
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
    handleModel(row) {
      this.fields = [];
      this.modelBox = true;
      this.loading = true;
      this.modelId = row.id;
      this.datasourceId = row.datasourceId;
      getModelPrototype(this.modelId, this.datasourceId).then(res => {
        const result = res.data;
        if (result.success) {
          this.fields = result.data;
          this.fields.forEach(item => {
            item.$cellEdit = true;
            item.modelId = this.modelId;
            // 根据字段物理类型自动适配实体类型
            if (!validatenull(item.name)) {
              item.jdbcName = item.name;
              item.jdbcType = item.propertyType;
              item.jdbcComment = item.comment;
              if (item.propertyType === 'LocalDateTime') {
                item.propertyType = 'Date';
                item.propertyEntity = 'java.util.Date';
              } else {
                entityDic.forEach(d => {
                  if (d.label === item.propertyType) {
                    item.propertyType = d.label;
                    item.propertyEntity = d.value;
                  }
                });
              }
            }
            // 首次加载配置默认值
            if (validatenull(item.id)) {
              item.isList = 1;
              item.isForm = 1;
              item.isRow = 0;
              item.isRequired = 0;
              item.isQuery = 0;
              item.componentType = 'input';
              // 默认不需要显示的字段名配置
              if (this.hideFields.includes(item.jdbcName)) {
                item.isList = 0;
                item.isForm = 0;
                item.isRequired = 0;
              }
            }
          });
          this.loading = false;
        }
      });
    },
    handleSubmit() {
      console.log(this.fields);
      this.$confirm('确定提交模型配置?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.fields.forEach(item => {
          entityDic.forEach(d => {
            if (d.value === item.propertyEntity) {
              item.propertyType = d.label;
            }
          });
        });
        submitModelPrototype(this.fields).then(res => {
          const result = res.data;
          if (result.success) {
            this.$message.success(result.msg);
            this.modelBox = false;
          } else {
            this.$message.error(result.msg);
          }
        });
      });
    },
  },
};
</script>

<style>
.none-border {
  border: 0;
  background-color: transparent !important;
}

.step-div {
  margin-top: 30px;
}
</style>
