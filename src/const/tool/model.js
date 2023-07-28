export const switchDic = [
  {
    label: '',
    value: 0,
  },
  {
    label: '',
    value: 1,
  },
];

export const entityDic = [
  {
    label: 'String',
    value: 'java.lang.String',
  },
  {
    label: 'Integer',
    value: 'java.lang.Integer',
  },
  {
    label: 'Long',
    value: 'java.lang.Long',
  },
  {
    label: 'Double',
    value: 'java.lang.Double',
  },
  {
    label: 'BigDecimal',
    value: 'java.math.BigDecimal',
  },
  {
    label: 'Boolean',
    value: 'java.lang.Boolean',
  },
  {
    label: 'Date',
    value: 'java.util.Date',
  },
];

export const componentDic = [
  {
    label: '单行文本',
    value: 'input',
  },
  {
    label: '多行文本',
    value: 'textarea',
  },
  {
    label: '富文本',
    value: 'editor',
  },
  {
    label: '下拉选项',
    value: 'select',
  },
  {
    label: '树形下拉选项',
    value: 'tree',
  },
  {
    label: '单选框',
    value: 'radio',
  },
  {
    label: '多选框',
    value: 'checkbox',
  },
  {
    label: '开关框',
    value: 'switch',
  },
  {
    label: '日期框',
    value: 'date',
  },
];

export const queryDic = [
  {
    label: '等于',
    value: 'equal',
  },
  {
    label: '不等于',
    value: 'notequal',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '大于等于',
    value: 'ge',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '小于等于',
    value: 'le',
  },
  {
    label: '区间',
    value: 'between',
  },
  {
    label: '模糊',
    value: 'like',
  },
  {
    label: '左模糊',
    value: 'likeleft',
  },
  {
    label: '右模糊',
    value: 'likeright',
  },
];

export const templateDic = [
  {
    label: '单表',
    value: 'crud',
  },
  {
    label: '主子表',
    value: 'sub',
  },
  {
    label: '树表',
    value: 'tree',
  },
];

export const option = {
  height: 'auto',
  searchShow: true,
  searchMenuSpan: 6,
  tip: false,
  border: true,
  index: true,
  viewBtn: true,
  selection: true,
  menuWidth: 250,
  column: [
    {
      label: '数据源',
      prop: 'datasourceId',
      search: true,
      span: 24,
      type: 'select',
      dicUrl: '/blade-develop/datasource/select',
      props: {
        label: 'name',
        value: 'id',
      },
      rules: [
        {
          required: true,
          message: '请选择数据源',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '物理表名',
      prop: 'modelTable',
      type: 'tree',
      slot: true,
      dicData: [],
      props: {
        label: 'comment',
        value: 'name',
      },
      rules: [
        {
          required: true,
          message: '请输入数据库表名',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '模型类名',
      prop: 'modelClass',
      rules: [
        {
          required: true,
          message: '请输入模型类名',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '模型名称',
      prop: 'modelName',
      search: true,
      rules: [
        {
          required: true,
          message: '请输入模型名称',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '模型编号',
      prop: 'modelCode',
      search: true,
      rules: [
        {
          required: true,
          message: '请输入模型编号',
          trigger: 'blur',
        },
      ],
    },
    {
      label: '模型备注',
      prop: 'modelRemark',
      hide: true,
      span: 24,
    },
  ],
};

export const optionModel = {
  border: true,
  index: true,
  addBtn: false,
  editBtn: false,
  addRowBtn: false,
  cellBtn: false,
  cancelBtn: false,
  tip: false,
  menu: false,
  selection: true,
  column: [
    {
      label: '物理列名',
      prop: 'jdbcName',
    },
    {
      label: '物理类型',
      prop: 'jdbcType',
    },
    {
      label: '实体列名',
      prop: 'propertyName',
      cell: true,
    },
    {
      label: '实体类型',
      prop: 'propertyEntity',
      type: 'select',
      dicData: entityDic,
      cell: true,
    },
    {
      label: '字段说明',
      prop: 'jdbcComment',
      cell: true,
    },
    {
      label: '列表显示',
      prop: 'isList',
      type: 'switch',
      dicData: switchDic,
      align: 'center',
      width: 60,
      cell: true,
    },
    {
      label: '表单显示',
      prop: 'isForm',
      type: 'switch',
      dicData: switchDic,
      align: 'center',
      width: 60,
      cell: true,
    },
    {
      label: '独占一行',
      prop: 'isRow',
      type: 'switch',
      dicData: switchDic,
      align: 'center',
      width: 60,
      cell: true,
    },
    {
      label: '必填',
      prop: 'isRequired',
      type: 'switch',
      dicData: switchDic,
      align: 'center',
      width: 60,
      cell: true,
    },
    {
      label: '组件类型',
      prop: 'componentType',
      type: 'select',
      dicData: componentDic,
      cell: true,
    },
    {
      label: '字典编码',
      prop: 'dictCode',
      type: 'select',
      dicUrl: '/blade-system/dict/select',
      props: {
        label: 'dictValue',
        value: 'code',
      },
      cell: true,
    },
    {
      label: '查询配置',
      prop: 'isQuery',
      type: 'switch',
      dicData: switchDic,
      align: 'center',
      width: 60,
      cell: true,
    },
    {
      label: '查询类型',
      prop: 'queryType',
      type: 'select',
      dicData: queryDic,
      cell: true,
    },
  ],
};
