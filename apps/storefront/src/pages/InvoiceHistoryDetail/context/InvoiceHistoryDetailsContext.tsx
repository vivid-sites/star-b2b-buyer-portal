import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react';

import {
  MoneyFormat,
  InvoiceHistoryAddress,
  InvoiceHistoryProductItemModel,
  InvoiceSummary
} from '../../../types';

export interface InvoiceHistoryDetailsState {
	invoiceNumber: string;
	invoiceDate: string;
	orderNumber?: string | null;
	poNumber?: string | null;
	customerId: number;
	pickTicketNumber?: number | null;
	orderDate?: string | null;
	orderStatus: string;
	subtotalAmount?: number | null;
	shippingAddress?: InvoiceHistoryAddress;
	billingAddress?: InvoiceHistoryAddress;
	invoiceValue: number;
	freight?: number | null;
	salesTax?: number | null;
	items: InvoiceHistoryProductItemModel[];
  invoiceSummary?: InvoiceSummary;
  money?: MoneyFormat;
}
interface InvoiceHistoryDetailsAction {
  type: string;
  payload: InvoiceHistoryDetailsState;
}
export interface InvoiceHistoryDetailsContextType {
  state: InvoiceHistoryDetailsState;
  dispatch: Dispatch<InvoiceHistoryDetailsAction>;
}

interface InvoiceHistoryDetailsProviderProps {
  children: ReactNode;
}

const defaultMoneyFormat: MoneyFormat = {
  currency_location: 'left',
  currency_token: '$',
  decimal_token: '.',
  decimal_places: 2,
  thousands_token: ',',
  currency_exchange_rate: '1.0000000000',
};

const initState = {
  orderNumber: '',
  invoiceNumber: '',
  customerId: 0,
  poNumber: '',
  orderStatus: '',
  invoiceDate: '',
  invoiceValue: 0,
  invoiceSummary: {
    invoiceDate: '',
    subtotalAmount: '',
    invoiceValue: '',
    freight: '',
    salesTax: '',
    poNumber: '',
    orderDate: '',
    orderNumber: '',
    pickTicketNumber: null,
    deliveryInstructions: '',
  },
  money: {
    ...defaultMoneyFormat,
  },
  items: [],
};

export const InvoiceHistoryDetailsContext = createContext<InvoiceHistoryDetailsContextType>({
  state: initState,
  dispatch: () => {},
});

const reducer = (state: InvoiceHistoryDetailsState, action: InvoiceHistoryDetailsAction) => {
  switch (action.type) {
    case 'all':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export function InvoiceHistoryDetailsProvider(props: InvoiceHistoryDetailsProviderProps) {
  const [state, dispatch] = useReducer(reducer, initState);

  const { children } = props;

  const InvoiceHistoryDetailsValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <InvoiceHistoryDetailsContext.Provider value={InvoiceHistoryDetailsValue}>
      {children}
    </InvoiceHistoryDetailsContext.Provider>
  );
}
