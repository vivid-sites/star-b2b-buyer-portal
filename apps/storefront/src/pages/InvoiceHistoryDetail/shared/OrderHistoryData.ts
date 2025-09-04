import { MoneyFormat } from "@/types";
import { InvoiceHistorySummary, InvoiceSummary } from "@/types/invoiceHistory";
import { getActiveCurrencyInfo } from "@/utils/currencyUtils";

const formatPrice = (price: string | number) => {
  const { decimal_places: decimalPlaces = 2 } = getActiveCurrencyInfo();
  try {
    const priceNumber = parseFloat(price.toString()) || 0;
    return priceNumber.toFixed(decimalPlaces);
  } catch (error) {
    return '0.00';
  }
};

const getInvoiceSummary = (data: InvoiceHistorySummary) => {
  const {
    invoiceNumber,
    invoiceDate,
    orderDate,
    orderNumber,
    poNumber,
    pickTicketNumber,
    deliveryInstructions,
    subtotalAmount,
    freight,
    salesTax,
    invoiceValue,
  } = data;

  const invoiceSummary: InvoiceSummary = {
    invoiceNumber: invoiceNumber,
    invoiceDate: invoiceDate,
    poNumber: poNumber,
    orderDate: orderDate,
    orderNumber: orderNumber,
    pickTicketNumber: pickTicketNumber,
    deliveryInstructions: deliveryInstructions,
    subtotalAmount: formatPrice(subtotalAmount || ''),
    invoiceValue: formatPrice(invoiceValue),
    freight: formatPrice(freight || ''),
    salesTax: formatPrice(salesTax || '')
  };

  return invoiceSummary;
};

export const convertInvoiceHistoryDetails = (data: InvoiceHistorySummary) => ({
  ...data,
	invoiceSummary: getInvoiceSummary(data),
	money: <MoneyFormat>{
    currency_location: 'left',
    currency_token: '$',
    decimal_token: '.',
    decimal_places: 2,
    thousands_token: ',',
    currency_exchange_rate: '1.0000000000',
  }
});