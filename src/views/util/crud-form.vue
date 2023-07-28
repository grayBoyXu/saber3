<template>
  <basic-container>
    <h3>点击新增或编辑跳转到新的页面</h3>
    <avue-crud :option="option" :data="data">
      <template #menu-left>
        <el-button type="primary" @click="handleForm()" icon="el-icon-plus">add</el-button>
      </template>
      <template #menu="{ row }">
        <el-button type="primary" text @click="handleForm(row.id)" icon="el-icon-edit"
          >edit
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
export default {
  data() {
    return {
      option: {
        addBtn: false,
        editBtn: false,
        column: [
          {
            label: '姓名',
            prop: 'name',
          },
        ],
      },
      data: [
        {
          id: 1,
          name: 'small',
        },
      ],
    };
  },
  methods: {
    handleForm(id) {
      this.$router.push({
        path: '/form-detail/index',
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style></style>
