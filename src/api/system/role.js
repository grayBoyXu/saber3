import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/blade-system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};
export const grantTree = () => {
  return request({
    url: '/blade-system/menu/grant-tree',
    method: 'get',
  });
};

export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds) => {
  return request({
    url: '/blade-system/role/grant',
    method: 'post',
    data: {
      roleIds,
      menuIds,
      dataScopeIds,
      apiScopeIds,
    },
  });
};

export const remove = ids => {
  return request({
    url: '/blade-system/role/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = row => {
  return request({
    url: '/blade-system/role/submit',
    method: 'post',
    data: row,
  });
};

export const update = row => {
  return request({
    url: '/blade-system/role/submit',
    method: 'post',
    data: row,
  });
};

export const getRole = roleIds => {
  return request({
    url: '/blade-system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    },
  });
};

export const getRoleTree = tenantId => {
  return request({
    url: '/blade-system/role/tree',
    method: 'get',
    params: {
      tenantId,
    },
  });
};

export const getRoleTreeById = roleId => {
  return request({
    url: '/blade-system/role/tree-by-id',
    method: 'get',
    params: {
      roleId,
    },
  });
};
