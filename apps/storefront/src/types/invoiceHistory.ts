
export interface InvoiceHistorySummary {
	invoiceNumber: string;
	invoiceDate: string;
	orderNumber?: string | null;
	poNumber?: string | null;
	customerId: number;
	companyNo: string;
	pickTicketNumber?: number | null;
	orderDate?: string | null;
	orderStatus: string;
	shippingAddress?: InvoiceHistoryAddress;
	billingAddress?: InvoiceHistoryAddress;
	deliveryInstructions?: string | null;
	invoiceValue: number;
	invoiceAdjustmentType?: string | null;
	claimNumber?: string | null;
	vendorInvoiceNumber?: string | null;
	vendorName?: string | null;
	consolidated: string;
	webShopperId?: number | null;
	webShopperEmail?: string | null;
	freight?: number | null;
	salesTax?: number | null;
	items: InvoiceHistoryProductItemModel[];
}

export interface InvoiceHistoryAddress {
	name?: string | null;
	address1?: string | null;
	address2?: string | null;
	city?: string | null;
	state?: string | null;
	zip?: string | null;
}

export interface InvoiceHistoryProductItem {
	orderNumber?: string | null;
	invoiceNumber?: string;
	productID?: string | null;
	productName?: string;
	unitPrice?: number;
	unitSize?: number | null;
	unitName?: string | null;
	orderQuantity?: number;
	extendedPrice?: number;
	sortOrder?: number;
	customerId?: number;
}

export interface InvoiceHistoryProductItemModel {
  sku: string;
  quantity: number;
  unitSize: number | null;
  unitName: string;
  unitPrice: number;
  name: string;
  extendedPrice: number;
}

export interface InvoiceSummary {
  invoiceNumber: string;
  invoiceDate: string;
  poNumber?: string | null;
  orderDate?: string | null;
  orderNumber?: string | null;
  pickTicketNumber?: number | null;
  deliveryInstructions?: string | null;
  freight?: string | null;
  salesTax?: string | null;
  invoiceValue: string;
}