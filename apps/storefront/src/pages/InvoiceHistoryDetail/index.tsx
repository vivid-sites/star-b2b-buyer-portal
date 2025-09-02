import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useB3Lang } from '@b3/lang';
import { ArrowBackIosNew } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import { b3HexToRgb, getContrastColor } from '@/components/outSideComponents/utils/b3CustomStyles';
import B3Spin from '@/components/spin/B3Spin';
import { useMobile } from '@/hooks';
import { CustomStyleContext } from '@/shared/customStyleButton';

import { InvoiceHistoryDetailsContext, InvoiceHistoryDetailsProvider } from './context/InvoiceHistoryDetailsContext';
import {
  B3ProductList,
  InvoiceAddress,
  InvoiceHistoryStatus,
  InvoiceSummaryCard,
  StoreAddress,
} from './components';
import { getOrderHistoryDetails } from '@/shared/service/vs';
import { convertInvoiceHistoryDetails } from './shared/OrderHistoryData';

function InvoiceHistoryDetail() {

  const params = useParams();

  const navigate = useNavigate();

  const b3Lang = useB3Lang();

  const {
    state: { orderStatus = '', money, billingAddress, shippingAddress, invoiceSummary, items },
    dispatch,
  } = useContext(InvoiceHistoryDetailsContext);

  const {
    state: {
      portalStyle: { backgroundColor = '#FEF9F5' },
    },
  } = useContext(CustomStyleContext);

  const customColor = getContrastColor(backgroundColor);

  const [isMobile] = useMobile();
  const [preInvoiceNumber, setPreInvoiceNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  useEffect(() => {
    setInvoiceNumber(params.id || '');
  }, [params]);

  const goToInvoiceHistory = () => {
    navigate('/invoice-history');
  };

  useEffect(() => {
    if (invoiceNumber) {
      const getOrderDetails = async () => {
        const id = parseInt(invoiceNumber, 10);
        if (!id) {
          return;
        }

        setIsRequestLoading(true);

        try {
          const order = await getOrderHistoryDetails(invoiceNumber);

          if (order) {
            const data = convertInvoiceHistoryDetails(order);
            dispatch({
              type: 'all',
              payload: data,
            });
            setPreInvoiceNumber(invoiceNumber);
          }
        } catch (err) {
          if (err === 'order does not exist') {
            setTimeout(() => {
              window.location.hash = `/invoice-history/${preInvoiceNumber}`;
            }, 1000);
          }
        } finally {
          setIsRequestLoading(false);
        }
      };

      getOrderDetails();
    }
    // Disabling rule since dispatch does not need to be in the dep array and b3Lang has rendering errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNumber, preInvoiceNumber]);

  return (
    <B3Spin isSpinning={isRequestLoading} background="rgba(255,255,255,0.2)">
      <Box
        sx={{
          overflow: 'auto',
          flex: 1,
        }}
      >
        <Box
          sx={{
            marginBottom: '10px',
            width: 'fit-content',
          }}
        >
          <Box
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={goToInvoiceHistory}
          >
            <ArrowBackIosNew
                  sx={{
                    fontSize: '13px',
                    margin: '0 8px',
                  }}
                />
                <span>{b3Lang('invoiceHistoryDetail.backToInvoiceHistory')}</span>
              
          </Box>
        </Box>

        <Stack spacing={2} direction="row" sx={{ width: '100%', alignItems: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                color: b3HexToRgb(customColor, 0.87) || '#263238',
                flex: '1 1 auto',
              }}
            >
              {b3Lang('invoiceHistoryDetail.invoiceNumber', { invoiceNumber })}
            </Typography>
            <InvoiceHistoryStatus status={orderStatus} />
        </Stack>

        <Grid
          container
          spacing={2}
          sx={{
            marginTop: '0',
            overflow: 'auto',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            paddingBottom: '20px',
          }}
        >
          <Grid
            item
            sx={
              isMobile
                ? {
                    flexBasis: '100%',
                  }
                : {
                    flexBasis: '690px',
                    flexGrow: 1,
                  }
            }
          >
            <Stack spacing={3}>

              <StoreAddress />

              <Card key={`items-${invoiceNumber}`}>
                <CardContent>
                  <Box
                    sx={{
                      wordBreak: 'break-word',
                      color: 'rgba(0, 0, 0, 0.87)',
                    }}
                  >
                    {items && <B3ProductList
                        products={items}
                        money={money}
                        textAlign={isMobile ? 'left' : 'right'}
                      />}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid
            item
            sx={
              isMobile
                ? {
                    flexBasis: '100%',
                  }
                : {
                    flexBasis: '340px',
                  }
            }
          >            
            {invoiceSummary && <InvoiceSummaryCard invoiceSummary={invoiceSummary} money={money} />}
            <Stack 
                direction="column"
                spacing={2}
                sx={{width: '100%'}}
              >
              {billingAddress && <InvoiceAddress type="billing" address={billingAddress} />}
              {shippingAddress && <InvoiceAddress type="shipping" address={shippingAddress} extra={invoiceSummary?.deliveryInstructions} />}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </B3Spin>
  );
}

function InvoiceHistoryDetailsContent() {
  return (
    <InvoiceHistoryDetailsProvider>
      <InvoiceHistoryDetail />
    </InvoiceHistoryDetailsProvider>
  );
}

export default InvoiceHistoryDetailsContent;
