import { B3Tag } from '@/components';

interface InvoiceHistoryStatusProps {
  status: string;
}

const ORDER_STATUS_COLOR = {
  COMPLETE: {
    color: '#C4DD6C',
    textColor: '#000000',
  },
  OPEN: {
    color: '#87CBF6',
    textColor: '#000000',
  }
};

export default function InvoiceHistoryStatus(props: InvoiceHistoryStatusProps) {
  const { status } = props;
  const statusColor = ORDER_STATUS_COLOR[status as keyof typeof ORDER_STATUS_COLOR];

  return status ? (
    <B3Tag color={statusColor?.color} textColor={statusColor?.textColor}>
      {status}
    </B3Tag>
  ) : null;
}
