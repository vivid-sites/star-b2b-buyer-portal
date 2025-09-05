import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useB3Lang } from '@/lib/lang';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { B2BAutoCompleteCheckbox } from '@/components';
import B3Filter from '@/components/filter/B3Filter';
import B3Spin from '@/components/spin/B3Spin';
import { useMobile } from '@/hooks';
import { useAppSelector } from '@/store';
import { CustomerRole, MoneyFormat } from '@/types';
import { ordersCurrencyFormat, displayFormat } from '@/utils';
import { DataSourceRequest } from '@/shared/service/vs/request/base';

import { B3Table, TableColumnItem } from './table/B3Table';
import {
  assertSortKey,
  FilterSearchProps,
  getFilterMoreData,
  getInitFilter,
  sortKeys,
} from './config';
import { InvoiceHistoryCard } from './components/InvoiceHistoryCard';

import {
  getInvoiceHistory,
} from './invoices';
import { InvoiceHistoryStatus } from '../InvoiceHistoryDetail/components';

interface ListItem {
  invoiceNumber: string;
  orderNumber: string;
  poNumber?: string;
  pickTicketNumber?: string;
  invoiceDate: string;
  subtotalAmount: string;
  orderStatus: string;
}

interface SearchChangeProps {
  startValue?: Date;
  endValue?: Date;
  poNumber?: string;
  orderNumber?: string;
  invoiceNumber?: string;
  pickTicketNumber?: string;
}

function useData() {
  const companyB2BId = useAppSelector(({ company }) => company.companyInfo.id);
  const role = useAppSelector(({ company }) => company.customer.role);
  const salesRepCompanyId = useAppSelector(({ b2bFeatures }) => b2bFeatures.masqueradeCompany.id);
  const isAgenting = useAppSelector(({ b2bFeatures }) => b2bFeatures.masqueradeCompany.isAgenting);

  const { order: orderSubViewPermission } = useAppSelector(
    ({ company }) => company.pagesSubsidiariesPermission,
  );

  const { selectCompanyHierarchyId, isEnabledCompanyHierarchy } = useAppSelector(
    ({ company }) => company.companyHierarchyInfo,
  );

  const currentCompanyId =
    role === CustomerRole.SUPER_ADMIN && isAgenting
      ? Number(salesRepCompanyId)
      : Number(companyB2BId);

  const companyId = companyB2BId || salesRepCompanyId;

  return {
    role,
    isAgenting,
    isEnabledCompanyHierarchy: isEnabledCompanyHierarchy && orderSubViewPermission,
    selectedCompanyId: Number(selectCompanyHierarchyId) || currentCompanyId,
    companyId,
  };
}

interface OrderBy {
  key: keyof typeof sortKeys;
  dir: 'asc' | 'desc';
}

const getOrderBy = ({ key, dir }: OrderBy) => {
  return dir === 'desc' ? `-${sortKeys[key]}` : sortKeys[key];
};

function InvoiceHistory() {
  const b3Lang = useB3Lang();
  const [isMobile] = useMobile();
  const { role, isAgenting, companyId, isEnabledCompanyHierarchy, selectedCompanyId } =
    useData();

  const [pagination, setPagination] = useState({ offset: 0, first: 10 });

  const [allTotal, setAllTotal] = useState(0);
  const [filterData, setFilterData] = useState<Partial<FilterSearchProps>>();
  const [filterInfo, setFilterInfo] = useState<Array<any>>([]);

  const [orderBy, setOrderBy] = useState<OrderBy>({
    key: 'invoiceNumber',
    dir: 'desc',
  });

  const handleSetOrderBy = (key: string) => {
    setOrderBy((prev) => {
      assertSortKey(key);

      if (prev.key === key) {
        return {
          key,
          dir: prev.dir === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key,
        dir: 'desc',
      };
    });
  };

  useEffect(() => {
    const search = getInitFilter(selectedCompanyId);

    setFilterData(search);

    const initFilter = async () => {

      const filterInfo = getFilterMoreData();

      const filterInfoWithTranslatedLabel = filterInfo.map((element) => {
        const translatedElement = element;
        translatedElement.label = b3Lang(element.idLang);

        return element;
      });

      setFilterInfo(filterInfoWithTranslatedLabel);
    };

    initFilter();
  }, [b3Lang, companyId, isAgenting, role, selectedCompanyId]);

  const fetchList = async ({
    ...params
  }: Partial<FilterSearchProps>): Promise<{ edges: ListItem[]; totalCount: number }> => {
    const requestData: Partial<DataSourceRequest> = {
      pageSize: pagination.first,
      skip: pagination.offset,
      sort: [
        {
          field: orderBy.key,
          dir: orderBy.dir,
        },
      ],
      companyId: params.companyId || '',
      companyIds: params.companyIds || [],
    };

    requestData.filter = requestData.filter || {
      logic: 'and'
    };
    requestData.filter.filters = requestData.filter.filters || [];

    for(const key in params) {
      if(key === 'beginDateAt' && params.beginDateAt) {
        requestData.filter.filters.push({
          field: 'invoiceDate',
          operator: 'gte',
          value: params.beginDateAt,
        });
      }
      else if(key === 'endDateAt' && params.endDateAt) {
        requestData.filter.filters.push({
          field: 'invoiceDate',
          operator: 'lte',
          value: params.endDateAt,
        });
      }
      else if(key === 'orderNumber' && params.orderNumber) {
        requestData.filter.filters.push({
          field: 'orderNumber',
          operator: 'contains',
          value: params.orderNumber,
        });
      }
      else if(key === 'poNumber' && params.poNumber) {
        requestData.filter.filters.push({
          field: 'poNumber',
          operator: 'contains',
          value: params.poNumber,
        });
      }
      else if(key === 'invoiceNumber' && params.invoiceNumber) {
        requestData.filter.filters.push({
          field: 'invoiceNumber',
          operator: 'contains',
          value: params.invoiceNumber,
        });
      }
      else if(key === 'pickTicketNumber' && params.pickTicketNumber) {
        requestData.filter.filters.push({
          field: 'pickTicketNumber',
          operator: 'contains',
          value: params.pickTicketNumber,
        });
      }
      else if(key === 'q' && params.q) {
        requestData.filter.filters.push({
          logic: 'or',
          filters: [
            {
              field: 'orderNumber',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'poNumber',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'invoiceNumber',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'pickTicketNumber',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToName',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToAddress',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToAddress2',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToCity',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToState',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'shipToZip',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToName',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToAddress',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToAddress2',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToCity',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToState',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'billToZip',
              operator: 'contains',
              value: params.q
            },
            {
              field: 'vendorName',
              operator: 'contains',
              value: params.q
            }
          ],
        });
      }
    }
    const { data = [], total } = await getInvoiceHistory(requestData);

    setAllTotal(total);

    return {
      edges: data,
      totalCount: total,
    };
  };

  const defaultMoneyFormat: MoneyFormat = {
    currency_location: 'left',
    currency_token: '$',
    decimal_token: '.',
    decimal_places: 2,
    thousands_token: ',',
    currency_exchange_rate: '1.0000000000',
  };

  const navigate = useNavigate();

  const goToDetail = (item: ListItem, index: number) => {
    navigate(`/invoice-history/${item.invoiceNumber}`, {
      state: {
        currentIndex: index,
        searchParams: {
          ...filterData,
          orderBy: getOrderBy(orderBy),
        },
        totalCount: allTotal,
        beginDateAt: filterData?.beginDateAt,
        endDateAt: filterData?.endDateAt,
      },
    });
  };

  const columnAllItems = [
    {
      key: 'invoiceNumber',
      title: b3Lang('invoiceHistory.invoiceNumber'),
      width: '10%',
      isSortable: true,
      render: ({ invoiceNumber }) => invoiceNumber,
    },
    {
      key: 'poNumber',
      title: b3Lang('invoiceHistory.poReference'),
      render: ({ poNumber }) => <Box>{poNumber || '–'}</Box>,
      width: '10%',
      isSortable: true,
    },
    {
      key: 'orderNumber',
      title: b3Lang('invoiceHistory.orderNumber'),
      render: ({ orderNumber }) => <Box>{orderNumber || '–'}</Box>,
      width: '10%',
      isSortable: true,
    },
    {
      key: 'pickTicketNumber',
      title: b3Lang('invoiceHistory.pickTicketNumber'),
      render: ({ pickTicketNumber }) => <Box>{pickTicketNumber || '–'}</Box>,
      width: '10%',
      isSortable: true,
    },
    {
      key: 'subtotalAmount',
      title: b3Lang('invoiceHistory.subtotalAmount'),
      render: ({ subtotalAmount }) => ordersCurrencyFormat(defaultMoneyFormat, subtotalAmount),
      align: 'right',
      width: '8%',
      isSortable: true,
    },
    {
      key: 'orderStatus',
      title: b3Lang('invoiceHistory.invoiceStatus'),
      render: ({ orderStatus }) => <InvoiceHistoryStatus status={orderStatus} />,
      width: '10%',
      isSortable: true,
    },
    {
      key: 'invoiceDate',
      title: b3Lang('invoiceHistory.invoiceDate'),
      render: ({ invoiceDate }) => {
        const timestamp = new Date(invoiceDate).getTime()/1000;
        const epoch = new Date(1970,0,1,0,0,0,0).getTime()/1000;
        return `${displayFormat(Number(timestamp - epoch))}`;
      },
      width: '10%',
      isSortable: true,
    },
  ] as const satisfies TableColumnItem<ListItem>[];

  const handleChange = (key: string, value: string) => {
    if (key === 'search') {
      setFilterData((data) => ({
        ...data,
        q: value,
      }));
    }
  };

  const handleFilterChange = (value: SearchChangeProps) => {
    setFilterData((data) => ({
      ...data,
      beginDateAt: value?.startValue || null,
      endDateAt: value?.endValue || null,
      poNumber: value?.poNumber || '',
      orderNumber: value?.orderNumber || '',
      invoiceNumber: value?.invoiceNumber || '',
      pickTicketNumber: value?.pickTicketNumber || '',
    }));
  };

  const columnItems = columnAllItems;

  const handleSelectCompanies = (company: number[]) => {
    const newCompanyIds = company.includes(-1) ? [] : company;

    setFilterData((data) => ({
      ...data,
      companyIds: newCompanyIds,
    }));
  };

  const { data, isFetching } = useQuery({
    queryKey: ['invoiceHistoryList', filterData, pagination, orderBy],
    enabled: Boolean(filterData),
    queryFn: () => fetchList({ selectedCompanyId, ...filterData, ...pagination, orderBy: getOrderBy(orderBy) }),
  });

  return (
    <B3Spin isSpinning={isFetching}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',

            '& > div': {
              width: isMobile ? '100%' : 'auto',
            },
          }}
        >
          {isEnabledCompanyHierarchy && (
            <Box sx={{ mr: isMobile ? 0 : '10px', mb: '30px' }}>
              <B2BAutoCompleteCheckbox handleChangeCompanyIds={handleSelectCompanies} />
            </Box>
          )}
          <B3Filter
            startPicker={{
              isEnabled: true,
              label: b3Lang('orders.from'),
              defaultValue: filterData?.beginDateAt || null,
              pickerKey: 'start',
            }}
            endPicker={{
              isEnabled: true,
              label: b3Lang('orders.to'),
              defaultValue: filterData?.endDateAt || null,
              pickerKey: 'end',
            }}
            filterMoreInfo={filterInfo}
            handleChange={handleChange}
            handleFilterChange={handleFilterChange}
            pcTotalWidth="100%"
            pcContainerWidth="100%"
            pcSearchContainerWidth="100%"
          />
        </Box>

        <B3Table
          columnItems={columnItems}
          listItems={data?.edges || []}
          pagination={{ ...pagination, count: data?.totalCount || 0 }}
          onPaginationChange={setPagination}
          isInfiniteScroll={isMobile}
          renderItem={(row, index) => (
            <InvoiceHistoryCard key={row.invoiceNumber} goToDetail={() => goToDetail(row, index)} item={row} />
          )}
          onClickRow={goToDetail}
          sortDirection={orderBy.dir}
          sortByFn={handleSetOrderBy}
          orderBy={orderBy.key}
        />
      </Box>
    </B3Spin>
  );
}

export default InvoiceHistory;
