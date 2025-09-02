import { getOrderHistory, DataSourceRequest } from '@/shared/service/vs';

export const getInvoiceHistory = (data: Partial<DataSourceRequest>) =>
  getOrderHistory(data).then((res) => {
    return res.result;
  });