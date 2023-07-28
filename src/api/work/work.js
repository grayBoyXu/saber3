import request from '@/axios';

export const startList = (current, size, params) => {
  return request({
    url: '/blade-flow/work/start-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const claimList = (current, size, params) => {
  return request({
    url: '/blade-flow/work/claim-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const todoList = (current, size, params) => {
  return request({
    url: '/blade-flow/work/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const sendList = (current, size, params) => {
  return request({
    url: '/blade-flow/work/send-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const doneList = (current, size, params) => {
  return request({
    url: '/blade-flow/work/done-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

export const claimTask = taskId => {
  return request({
    url: '/blade-flow/work/claim-task',
    method: 'post',
    params: {
      taskId,
    },
  });
};

export const completeTask = data => {
  return request({
    url: '/blade-flow/work/complete-task',
    method: 'post',
    data,
  });
};
