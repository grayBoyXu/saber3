import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/blade-resource/oss/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const getDetail = id => {
  return request({
    url: '/blade-resource/oss/detail',
    method: 'get',
    params: {
      id,
    },
  });
};

export const remove = ids => {
  return request({
    url: '/blade-resource/oss/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = row => {
  return request({
    url: '/blade-resource/oss/submit',
    method: 'post',
    data: row,
  });
};

export const update = row => {
  return request({
    url: '/blade-resource/oss/submit',
    method: 'post',
    data: row,
  });
};

export const enable = id => {
  return request({
    url: '/blade-resource/oss/enable',
    method: 'post',
    params: {
      id,
    },
  });
};
