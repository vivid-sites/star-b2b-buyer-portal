import VSRequest from '../request/vsFetch';
import { DataSourceRequest } from '../request/base';

const getOrderHistory = (data: Partial<DataSourceRequest>) =>
	VSRequest.post(
    '/storefront/orderhistory/',
    data,
  );

export default getOrderHistory;
