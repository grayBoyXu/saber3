<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @tree-load="treeLoad"
    >
      <template #menu="{ row }">
        <el-button
          type="primary"
          text
          icon="el-icon-setting"
          v-if="permission.api_scope_setting"
          plain
          style="border: 0; background-color: transparent !important"
          @click.stop="handleDataScope(row)"
          >权限配置
        </el-button>
      </template>
      <template #name="{ row }">
        <i :class="row.source" style="margin-right: 5px" />
        <span>{{ row.name }}</span>
      </template>
      <template #source="{ row }">
        <div style="text-align: center">
          <i :class="row.source" />
        </div>
      </template>
    </avue-crud>
    <el-drawer
      :title="`[${scopeMenuName}] 接口权限配置`"
      v-model="drawerVisible"
      :direction="direction"
      append-to-body
      :before-close="handleDrawerClose"
      size="1000px"
    >
      <basic-container>
        <avue-crud
          :option="optionScope"
          :data="dataScope"
          :page="pageScope"
          v-model="formScope"
          :table-loading="scopeLoading"
          ref="crudScope"
          @row-del="rowDelScope"
          @row-update="rowUpdateScope"
          @row-save="rowSaveScope"
          :before-open="beforeOpenScope"
          @search-change="searchChangeScope"
          @search-reset="searchResetScope"
          @selection-change="selectionChangeScope"
          @current-change="currentChangeScope"
          @size-change="sizeChangeScope"
          @on-load="onLoadScope"
        >
          <template #menu-left>
            <el-button type="danger" icon="el-icon-delete" plain @click="handleDeleteScope"
              >删 除
            </el-button>
          </template>
          <template #scopeType="{ row }">
            <el-tag>{{ row.scopeTypeName }}</el-tag>
          </template>
        </avue-crud>
      </basic-container>
    </el-drawer>
  </basic-container>
</template>

<script>
import { add, remove, update, getLazyMenuList, getMenu } from '@/api/system/menu';
import {
  addApiScope,
  removeApiScope,
  updateApiScope,
  getListApiScope,
  getMenuApiScope,
} from '@/api/system/scope';
import { mapGetters } from 'vuex';
import iconList from '@/config/iconList';

export default {
  data() {
    return {
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      parentId: 0,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      drawerVisible: false,
      direction: 'rtl',
      scopeLoading: false,
      scopeMenuId: 0,
      scopeMenuName: '菜单',
      menu: true,
      option: {
        lazy: true,
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: '60%',
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        column: [
          {
            label: '菜单名称',
            prop: 'name',
            width: 300,
            search: true,
            rules: [
              {
                required: true,
                message: '请输入菜单名称',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '路由地址',
            prop: 'path',
            rules: [
              {
                required: true,
                message: '请输入路由地址',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '上级菜单',
            prop: 'parentId',
            type: 'tree',
            dicUrl: '/blade-system/menu/tree',
            hide: true,
            props: {
              label: 'title',
            },
            rules: [
              {
                required: false,
                message: '请选择上级菜单',
                trigger: 'click',
              },
            ],
          },
          {
            label: '菜单图标',
            prop: 'source',
            type: 'icon',
            slot: true,
            width: 85,
            iconList: iconList,
            rules: [
              {
                required: true,
                message: '请输入菜单图标',
                trigger: 'click',
              },
            ],
          },
          {
            label: '菜单编号',
            prop: 'code',
            search: true,
            rules: [
              {
                required: true,
                message: '请输入菜单编号',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '菜单类型',
            prop: 'category',
            type: 'radio',
            dicData: [
              {
                label: '菜单',
                value: 1,
              },
              {
                label: '按钮',
                value: 2,
              },
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: '请选择菜单类型',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '菜单别名',
            prop: 'alias',
            rules: [
              {
                required: true,
                message: '请输入菜单别名',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '按钮功能',
            prop: 'action',
            type: 'radio',
            dicData: [
              {
                label: '工具栏',
                value: 0,
              },
              {
                label: '操作栏',
                value: 1,
              },
              {
                label: '工具操作栏',
                value: 2,
              },
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: '请选择按钮功能',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '菜单排序',
            prop: 'sort',
            type: 'number',
            width: 85,
            rules: [
              {
                required: true,
                message: '请输入菜单排序',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '新窗口',
            prop: 'isOpen',
            type: 'radio',
            dicData: [
              {
                label: '否',
                value: 0,
              },
              {
                label: '是',
                value: 1,
              },
            ],
            hide: true,
          },
          {
            label: '菜单备注',
            prop: 'remark',
            type: 'textarea',
            span: 24,
            minRows: 6,
            hide: true,
          },
        ],
      },
      data: [],
      formScope: {},
      selectionListScope: [],
      pageScope: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      optionScope: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        menuWidth: 200,
        dialogWidth: 900,
        dialogClickModal: false,
        column: [
          {
            label: '权限名称',
            prop: 'scopeName',
            search: true,
            rules: [
              {
                required: true,
                message: '请输入权限名称',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '权限编号',
            prop: 'resourceCode',
            search: true,
            width: 180,
            rules: [
              {
                required: true,
                message: '请输入权限编号',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '权限路径',
            prop: 'scopePath',
            width: 180,
            rules: [
              {
                required: true,
                message: '请输入权限编号',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '接口类型',
            type: 'select',
            dicUrl: '/blade-system/dict/dictionary?code=api_scope_type',
            props: {
              label: 'dictValue',
              value: 'dictKey',
            },
            dataType: 'number',
            slot: true,
            width: 100,
            prop: 'scopeType',
            rules: [
              {
                required: true,
                message: '请输入通知类型',
                trigger: 'blur',
              },
            ],
          },
          {
            label: '备注',
            prop: 'remark',
            span: 24,
            hide: true,
          },
        ],
      },
      dataScope: [],
    };
  },

  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.validData(this.permission.menu_add, false),
        viewBtn: this.validData(this.permission.menu_view, false),
        delBtn: this.validData(this.permission.menu_delete, false),
        editBtn: this.validData(this.permission.menu_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
    scopeIds() {
      let ids = [];
      this.selectionListScope.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
  },
  methods: {
    // 菜单管理模块
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
      this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.parentId = '';
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
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getMenu(this.form.id).then(res => {
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
      getLazyMenuList(this.parentId, Object.assign(params, this.query)).then(res => {
        this.data = res.data.data;
        this.loading = false;
        this.selectionClear();
      });
    },
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      getLazyMenuList(parentId).then(res => {
        resolve(res.data.data);
      });
    },
    // 数据权限模块
    handleDataScope(row) {
      this.drawerVisible = true;
      this.scopeMenuId = row.id;
      this.scopeMenuName = row.name;
      this.onLoadScope(this.pageScope);
    },
    handleDrawerClose(hide) {
      hide();
    },
    rowSaveScope(row, done, loading) {
      row = {
        ...row,
        menuId: this.scopeMenuId,
      };
      addApiScope(row).then(
        () => {
          this.onLoadScope(this.pageScope);
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
    rowUpdateScope(row, index, done, loading) {
      row = {
        ...row,
        menuId: this.scopeMenuId,
      };
      updateApiScope(row).then(
        () => {
          this.onLoadScope(this.pageScope);
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
    rowDelScope(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return removeApiScope(row.id);
        })
        .then(() => {
          this.onLoadScope(this.pageScope);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
    },
    handleDeleteScope() {
      if (this.selectionListScope.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return removeApiScope(this.scopeIds);
        })
        .then(() => {
          this.onLoadScope(this.pageScope);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.$refs.crudScope.toggleSelection();
        });
    },
    beforeOpenScope(done, type) {
      if (['edit', 'view'].includes(type)) {
        getMenuApiScope(this.formScope.id).then(res => {
          this.formScope = res.data.data;
        });
      }
      done();
    },
    searchResetScope() {
      this.onLoadScope(this.pageScope);
    },
    searchChangeScope(params, done) {
      this.onLoadScope(this.pageScope, params);
      done();
    },
    selectionChangeScope(list) {
      this.selectionListScope = list;
    },
    currentChangeScope(currentPage) {
      this.pageScope.currentPage = currentPage;
    },
    sizeChangeScope(pageSize) {
      this.pageScope.pageSize = pageSize;
    },
    onLoadScope(page, params = {}) {
      this.scopeLoading = true;
      const values = {
        ...params,
        menuId: this.scopeMenuId,
      };
      getListApiScope(page.currentPage, page.pageSize, Object.assign(values, this.query)).then(
        res => {
          const data = res.data.data;
          this.pageScope.total = data.total;
          this.dataScope = data.records;
          this.selectionListScope = [];
          this.scopeLoading = false;
        }
      );
    },
  },
};
</script>
