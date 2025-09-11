import VSRequest from '../request/vsFetch';
import { DataSourceRequest } from '../request/base';
import {
  InvoiceHistoryProductItem,
  InvoiceHistoryProductItemModel,
  InvoiceHistorySummary
} from '@/types/invoiceHistory';

export const getOrderHistory = (data: Partial<DataSourceRequest>) =>
	VSRequest.post(
    '/storefront/orderhistory/',
    data,
  );

export const getOrderHistoryDetails = (invoiceNumber: string): Promise<InvoiceHistorySummary> =>
	VSRequest.get(
    `/storefront/orderhistory/${invoiceNumber}`,
  ).then((res) => {
    return {
      invoiceNumber: res.invoiceNumber,
      invoiceDate: res.invoiceDate,
      orderNumber: res.orderNumber,
      poNumber: res.poNumber,
      customerId: res.customerId,
      companyNo: res.companyNo,
      pickTicketNumber: res.pickTicketNumber,
      orderDate: res.orderDate,
      orderStatus: res.orderStatus,
      shippingAddress: {
        name: res.shipToName,
        address1: res.shipToAddress,
        address2: res.shipToAddress2,
        city: res.shipToCity,
        state: res.shipToState,
        zip: res.shipToZip,
      },
      billingAddress: {
        name: res.billToName,
        address1: res.billToAddress,
        address2: res.billToAddress2,
        city: res.billToCity,
        state: res.billToState,
        zip: res.billToZip,
      },
      deliveryInstructions: res.deliveryInstructions,
      invoiceValue: res.invoiceValue,
      invoiceAdjustmentType: res.invoiceAdjustmentType,
      claimNumber: res.claimNumber,
      vendorInvoiceNumber: res.vendorInvoiceNumber,
      vendorName: res.vendorName,
      consolidated: res.consolidated,
      webShopperId: res.webShopperId,
      webShopperEmail: res.webShopperEmail,
      freight: res.freight,
      salesTax: res.salesTax,
      items: res.items.map((item: InvoiceHistoryProductItem) => (<InvoiceHistoryProductItemModel>{
        id: item.sortOrder,
        sku: item.productID,
        quantity: item.orderQuantity,
        name: item.productName,
        unitSize: item.unitSize,
        unitName: item.unitName,
        unitPrice: item.unitPrice,
        extendedPrice: item.extendedPrice,
      })),
    }
  });