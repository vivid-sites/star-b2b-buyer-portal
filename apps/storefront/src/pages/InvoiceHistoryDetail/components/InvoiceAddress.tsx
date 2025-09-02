import { Fragment } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

import { InvoiceHistoryAddress } from '../../../types';
import { useB3Lang } from '@b3/lang';

type InvoiceAddressProps = {
  type: 'billing' | 'shipping';
  address: InvoiceHistoryAddress;
  extra?: string | null;
};

export default function InvoiceAddress({ type, address, extra }: InvoiceAddressProps) {

  const b3Lang = useB3Lang();

  const getFullAddress = (billingAddress: InvoiceHistoryAddress): string[] => {
    if (billingAddress) {
      const { address1, address2, city, state, zip } = billingAddress;

      let ret: string[] = [];

      if(address1) {
        let line1 = `${address1}, `;
        if(address2) {
          line1 += `${address2}`;
          if(city || state || zip) {
            line1 += ',';
          }
        }
        ret.push(line1);
      }

      let line2 = '';
      if(city) {
        line2 += `${city}, `;
      }
      if(state) {
        line2 += `${state}, `;
      }
      if(zip) {
        line2 += `${zip}`;
      }
      if(line2) {
        ret.push(line2);
      }
      return ret;
    }

    return [];
  };

  return (
    <Card sx={{ flex: '1 1 50%' }}>
      <CardContent>
        <Box
          sx={{
            wordBreak: 'break-word',
            color: 'rgba(0, 0, 0, 0.87)',
          }}
        >
          <Typography variant="subtitle1">
            {type === 'billing' ? b3Lang('invoiceHistoryDetail.billingAddress') : b3Lang('invoiceHistoryDetail.shippingAddress')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '400',
            }}
          >
            {address.name}
          </Typography>
          {getFullAddress(address).map((line, idx) => (
            <Typography
              variant="h6"
              key={`${type}-address-line-${idx}`}
              sx={{
                fontWeight: '400',
              }}
            >{line}</Typography>
          ))}
          {extra && (
            <Fragment>
              <Divider
                sx={{
                  marginBottom: '1rem',
                  marginTop: '0.5rem',
                }}
              />
              <Typography variant="subtitle1">
                {b3Lang('invoiceHistoryDetail.deliveryInstructions')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '400',
                }}
              >{extra}</Typography>
            </Fragment>
          )}
      </Box>
      </CardContent>
    </Card>
  );
}
