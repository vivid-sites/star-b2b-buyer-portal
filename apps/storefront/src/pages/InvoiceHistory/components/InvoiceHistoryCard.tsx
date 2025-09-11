import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { currencyFormat, displayFormat } from '@/utils';

interface ListItem {
  invoiceNumber: string;
  orderNumber: string;
  poNumber?: string;
  invoiceDate: string;
  invoiceValue: string;
  orderStatus: string;
}

export interface InvoiceHistoryCardProps {
  goToDetail: () => void;
  item: ListItem;
}

const Flex = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  '&.between-flex': {
    justifyContent: 'space-between',
  },
}));

export function InvoiceHistoryCard({ item, goToDetail }: InvoiceHistoryCardProps) {
  const theme = useTheme();

  return (
    <Card key={item.invoiceNumber}>
      <CardContent sx={{ color: 'rgba(0, 0, 0, 0.6)' }} onClick={goToDetail}>
        <Flex className="between-flex">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(0, 0, 0, 0.87)',
              }}
            >
              {`# ${item.invoiceNumber}`}
            </Typography>
            <Typography
              sx={{
                ml: 1,
              }}
              variant="body2"
            >
              {item.orderNumber ? item.orderNumber : '–'}
            </Typography>
            <Typography
              sx={{
                ml: 1,
              }}
              variant="body2"
            >
              {item.poNumber ? item.poNumber : '–'}
            </Typography>
          </Box>
          <Box>
            <Typography>{`${item.orderStatus}`}</Typography>
          </Box>
        </Flex>

        <Typography
          variant="h6"
          sx={{
            marginBottom: theme.spacing(2.5),
            mt: theme.spacing(1.5),
            minHeight: '1.43em',
          }}
        >
          {currencyFormat(item.invoiceValue)}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography>{`${displayFormat(item.invoiceDate)}`}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
