export interface FilterSearchProps {
  [key: string]: string | Date | number | number[] | null;
  beginDateAt: Date | null;
  endDateAt: Date | null;
  orderBy: string;
  companyId: string;
  companyIds: number[];
  poNumber: string;
  orderNumber: string;
  invoiceNumber: string;
  pickTicketNumber: string;
  q: string;
}

export interface FilterMoreProps {
  startValue?: string;
  endValue?: string;
}

export const sortKeys = {
  invoiceNumber: 'invoiceNumber',
  poNumber: 'poNumber',
  orderNumber: 'orderNumber',
  status: 'status',
  invoiceDate: 'invoiceDate',
  pickTicketNumber: 'pickTicketNumber',
};

export function assertSortKey(key: string): asserts key is keyof typeof sortKeys {
  if (!Object.keys(sortKeys).includes(key)) {
    throw new Error(`Invalid sort key: ${key}`);
  }
}


export const getFilterMoreData = () => {

  const filterMoreList = [
    {
      name: 'invoiceNumber',
      label: 'Invoice #',
      required: false,
      default: '',
      fieldType: 'text',
      xs: 12,
      variant: 'filled',
      size: 'small',
      idLang: 'invoiceHistory.invoiceNumber',
    },
    {
      name: 'orderNumber',
      label: 'Order #',
      required: false,
      default: '',
      fieldType: 'text',
      xs: 12,
      variant: 'filled',
      size: 'small',
      idLang: 'invoiceHistory.orderNumber',
    },
    {
      name: 'poNumber',
      label: 'PO / Reference #',
      required: false,
      default: '',
      fieldType: 'text',
      xs: 12,
      variant: 'filled',
      size: 'small',
      idLang: 'invoiceHistory.poReference',
    },
    {
      name: 'pickTicketNumber',
      label: 'Pick Ticket #',
      required: false,
      default: '',
      fieldType: 'text',
      xs: 12,
      variant: 'filled',
      size: 'small',
      idLang: 'invoiceHistory.pickTicketNumber',
    }
  ];

  return filterMoreList;
};

export const getInitFilter = (selectedCompanyId: number): Partial<FilterSearchProps> => {
  return {
    beginDateAt: null,
    endDateAt: null,
    companyId: '',
    poNumber: '',
    orderNumber: '',
    invoiceNumber: '',
    pickTicketNumber: '',
    companyIds: [selectedCompanyId],
    q: '',
  };
};