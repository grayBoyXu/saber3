import request from '@/axios';

// =====================参数===========================

export const historyFlowList = processInstanceId => {
  return request({
    url: '/blade-flow/process/history-flow-list',
    method: 'get',
    params: {
      processInstanceId,
    },
  });
};

// =====================请假流程===========================

export const leaveProcess = data => {
  return request({
    url: '/blade-desk/process/leave/start-process',
    method: 'post',
    data,
  });
};

export const leaveDetail = businessId => {
  return request({
    url: '/blade-desk/process/leave/detail',
    method: 'get',
    params: {
      businessId,
    },
  });
};
