import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/blade-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const getParentList = (current, size, params) => {
  return request({
    url: '/blade-system/dict/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const getChildList = (current, size, parentId, params) => {
  return request({
    url: '/blade-system/dict/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId,
    },
  });
};

export const remove = ids => {
  return request({
    url: '/blade-system/dict/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = row => {
  return request({
    url: '/blade-system/dict/submit',
    method: 'post',
    data: row,
  });
};

export const update = row => {
  return request({
    url: '/blade-system/dict/submit',
    method: 'post',
    data: row,
  });
};

export const getDict = id => {
  return request({
    url: '/blade-system/dict/detail',
    method: 'get',
    params: {
      id,
    },
  });
};
export const getDictTree = () => {
  return request({
    url: '/blade-system/dict/tree?code=DICT',
    method: 'get',
  });
};

export const getDictionary = params => {
  return request({
    url: '/blade-system/dict/dictionary',
    method: 'get',
    params,
  });
};
