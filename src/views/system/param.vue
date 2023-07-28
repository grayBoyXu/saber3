<template>
  <basic-container>
    <div class="avue-crud">
      <el-row :hidden="!search" style="padding: 6px 18px">
        <!-- 查询模块 -->
        <el-form :inline="true" :model="query">
          <el-form-item label="参数名:">
            <el-input v-model="query.paramName" placeholder="请输入参数名"></el-input>
          </el-form-item>
          <el-form-item label="参数键:">
            <el-input v-model="query.paramKey" placeholder="请输入参数键"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchChange">搜 索</el-button>
            <el-button icon="el-icon-delete" @click="searchReset()">清 空</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="avue-crud__header">
          <!-- 头部左侧按钮模块 -->
          <div class="avue-crud__left">
            <el-button
              v-if="this.permissionList.addBtn"
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
              >新 增
            </el-button>
            <el-button
              v-if="this.permissionList.delBtn"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete"
              plain
              >删 除
            </el-button>
          </div>
          <!-- 头部右侧按钮模块 -->
          <div class="avue-crud__right">
            <el-button icon="el-icon-refresh" @click="searchChange" circle></el-button>
            <el-button icon="el-icon-search" @click="searchHide" circle></el-button>
          </div>
        </div>
      </el-row>
      <el-row>
        <!-- 列表模块 -->
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="selectionChange"
          :data="data"
          :height="height"
          style="width: 100%"
          :border="option.border"
        >
          <el-table-column
            type="selection"
            v-if="option.selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column type="expand" v-if="option.expand" align="center"></el-table-column>
          <el-table-column v-if="option.index" label="#" type="index" width="50" align="center">
          </el-table-column>
          <template v-for="(item, index) in option.column">
            <!-- table字段 -->
            <el-table-column
              v-if="item.hide !== true"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :key="index"
            >
            </el-table-column>
          </template>
          <!-- 操作栏模块 -->
          <el-table-column prop="menu" label="操作" :width="220" align="center">
            <template #="{ row }">
              <el-button
                v-if="this.permissionList.viewBtn"
                type="primary"
                text
                icon="el-icon-view"
                @click="handleView(row)"
                >查看
              </el-button>
              <el-button
                v-if="this.permissionList.editBtn"
                type="primary"
                text
                icon="el-icon-edit"
                @click="handleEdit(row)"
                >编辑
              </el-button>
              <el-button
                v-if="this.permissionList.delBtn"
                type="primary"
                text
                icon="el-icon-delete"
                @click="rowDel(row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="avue-crud__pagination" style="width: 100%">
          <!-- 分页模块 -->
          <el-pagination
            align="right"
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </div>
      </el-row>
      <!-- 表单模块 -->
      <el-dialog
        :title="title"
        v-model="box"
        width="50%"
        :before-close="beforeClose"
        append-to-body
      >
        <el-form :disabled="view" ref="form" :model="form" label-width="80px">
          <!-- 表单字段 -->
          <el-form-item label="参数名:" prop="paramName">
            <el-input v-model="form.paramName" placeholder="请输入参数名" />
          </el-form-item>
          <el-form-item label="参数键:" prop="paramKey">
            <el-input v-model="form.paramKey" placeholder="请输入参数键" />
          </el-form-item>
          <el-form-item label="参数值:" prop="paramValue">
            <el-input v-model="form.paramValue" placeholder="请输入参数值" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <!-- 表单按钮 -->
        <template #footer>
          <span v-if="!view" class="dialog-footer">
            <el-button type="primary" icon="el-icon-circle-check" @click="handleSubmit"
              >提 交</el-button
            >
            <el-button icon="el-icon-circle-close" @click="box = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/system/param';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      height: 0,
      // 弹框标题
      title: '',
      // 是否展示弹框
      box: false,
      // 是否显示查询
      search: true,
      // 加载中
      loading: true,
      // 是否为查看模式
      view: false,
      // 查询信息
      query: {},
      // 分页信息
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 40,
      },
      // 表单数据
      form: {},
      // 选择行
      selectionList: [],
      // 表单配置
      option: {
        expand: false,
        index: true,
        border: true,
        selection: true,
        column: [
          {
            label: '参数名',
            prop: 'paramName',
          },
          {
            label: '参数键',
            prop: 'paramKey',
          },
          {
            label: '参数值',
            prop: 'paramValue',
          },
          {
            label: '备注',
            prop: 'remark',
          },
        ],
      },
      // 表单列表
      data: [],
    };
  },
  mounted() {
    this.init();
    this.onLoad(this.page);
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.validData(this.permission.param_add, false),
        viewBtn: this.validData(this.permission.param_view, false),
        delBtn: this.validData(this.permission.param_delete, false),
        editBtn: this.validData(this.permission.param_edit, false),
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
    init() {
      this.height = this.setPx(document.body.clientHeight - 340);
    },
    searchHide() {
      this.search = !this.search;
    },
    searchChange() {
      this.onLoad(this.page);
    },
    searchReset() {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    handleSubmit() {
      if (!this.form.id) {
        add(this.form).then(() => {
          this.box = false;
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
      } else {
        update(this.form).then(() => {
          this.box = false;
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
      }
    },
    handleAdd() {
      this.title = '新增';
      this.form = {};
      this.box = true;
    },
    handleEdit(row) {
      this.title = '编辑';
      this.box = true;
      getDetail(row.id).then(res => {
        this.form = res.data.data;
      });
    },
    handleView(row) {
      this.title = '查看';
      this.view = true;
      this.box = true;
      getDetail(row.id).then(res => {
        this.form = res.data.data;
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
          this.selectionClear();
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
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
    beforeClose(done) {
      done();
      this.form = {};
      this.view = false;
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.table.clearSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page);
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
