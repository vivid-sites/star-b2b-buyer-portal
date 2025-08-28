export interface FilterSearchProps {
  [key: string]: string | number | number[] | null;
  beginDateAt: string | null;
  endDateAt: string | null;
  orderBy: string;
  companyId: string;
  companyIds: number[];
  poNumber: string;
  orderNumber: string;
  invoiceNumber: string;
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
};

export function assertSortKey(key: string): asserts key is keyof typeof sortKeys {
  if (!Object.keys(sortKeys).includes(key)) {
    throw new Error(`Invalid sort key: ${key}`);
  }
}

export const getInitFilter = (selectedCompanyId: number): Partial<FilterSearchProps> => {
  return {
    beginDateAt: null,
    endDateAt: null,
    companyId: '',
    poNumber: '',
    orderNumber: '',
    invoiceNumber: '',
    companyIds: [selectedCompanyId],
    q: '',
  };
};