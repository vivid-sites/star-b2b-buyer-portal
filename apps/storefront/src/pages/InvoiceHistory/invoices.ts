import getOrderHistory from '@/shared/service/vs/api/orderHistory';
import { DataSourceRequest } from '@/shared/service/vs/request/base';

export const getInvoiceHistory = (data: Partial<DataSourceRequest>) =>
  getOrderHistory(data).then((res) => {
    return res.result;
  });