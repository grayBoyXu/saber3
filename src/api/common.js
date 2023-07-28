import request from '@/axios';

/**
 * 文件流返回
 * @param url 接口地址
 * @param params 接口参数
 */
export const exportBlob = (url, params) => {
  return request({
    url: url,
    params: params,
    method: 'get',
    responseType: 'blob',
  });
};
