import serviceAxios from '@/utils/http';
import { useRequest } from 'ahooks';

export const useReq = (options: any = {}) => {
  const data = useRequest(serviceAxios, {
    manual: true,
    ...options,
  });

  return data;
};
