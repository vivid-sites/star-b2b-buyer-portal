import { useB3Lang } from '@b3/lang';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import { useMobile } from '@/hooks';
import { currencyFormat, ordersCurrencyFormat } from '@/utils';

import { InvoiceHistoryProductItemModel, MoneyFormat } from '../../../types';

interface FlexProps {
  isHeader?: boolean;
  isMobile?: boolean;
}

interface FlexItemProps {
  width?: string;
  padding?: string;
  textAlignLocation?: string;
  sx?: {
    [key: string]: string | number;
  };
}

const Flex = styled('div')<FlexProps>(({ isHeader, isMobile }) => {
  const headerStyle = isHeader
    ? {
        borderBottom: '1px solid #D9DCE9',
        paddingBottom: '8px',
      }
    : {};

  const mobileStyle = isMobile
    ? {
        borderTop: '1px solid #D9DCE9',
        padding: '12px 0 12px',
        '&:first-of-type': {
          marginTop: '12px',
        },
      }
    : {};

  const flexWrap = isMobile ? 'wrap' : 'initial';

  return {
    color: '#212121',
    display: 'flex',
    padding: '8px 0 0',
    gap: '8px',
    flexWrap,
    alignItems: ' flex-start',
    ...headerStyle,
    ...mobileStyle,
  };
});

const FlexItem = styled('div')(
  ({ width, textAlignLocation, padding = '0', sx }: FlexItemProps) => ({
    display: 'flex',
    justifyContent: textAlignLocation === 'right' ? 'flex-end' : 'flex-start',
    flexGrow: width ? 0 : 1,
    flexShrink: width ? 0 : 1,
    alignItems: 'center',
    width,
    padding,
    ...sx,
  }),
);

const ProductHead = styled('div')(() => ({
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: '#263238',
}));

const defaultItemStyle = {
  default: {
    width: '12%',
  },
  qty: {
    width: '9%',
  },
};

const mobileItemStyle = {
  default: {
    width: '100%',
    padding: '0 0 0 76px',
  },
  qty: {
    width: '100%',
    padding: '0 0 0 76px',
  },
};

interface ProductProps<T> {
  products: Array<T & InvoiceHistoryProductItemModel>;
  money?: MoneyFormat;
  textAlign?: string;
}

export default function B3ProductList<T>(props: ProductProps<T>) {
  const {
    products,
    textAlign = 'left',
    money,
  } = props;

  const formatPrice = (price: number) => {
    return money ? ordersCurrencyFormat(money, price) : currencyFormat(price);
  };

  const [isMobile] = useMobile();
  const b3Lang = useB3Lang();

  const itemStyle = isMobile ? mobileItemStyle : defaultItemStyle;

  return products.length > 0 ? (
    <Box>
      {!isMobile && (
        <Flex isHeader isMobile={isMobile}>
          <FlexItem padding={isMobile ? '0' : '0 6% 0 0'}>
            <ProductHead>{b3Lang('global.searchProduct.product')}</ProductHead>
          </FlexItem>
          <FlexItem textAlignLocation={textAlign} {...itemStyle.default}>
            <ProductHead>{b3Lang('invoiceHistoryDetail.unitPrice')}</ProductHead>
          </FlexItem>
          <FlexItem textAlignLocation={textAlign} {...itemStyle.qty}>
            <ProductHead>{b3Lang('invoiceHistoryDetail.unitSize')}</ProductHead>
          </FlexItem>
          <FlexItem textAlignLocation={textAlign} {...itemStyle.qty}>
            <ProductHead>{b3Lang('invoiceHistoryDetail.unitName')}</ProductHead>
          </FlexItem>
          <FlexItem textAlignLocation={textAlign} {...itemStyle.qty}>
            <ProductHead>{b3Lang('invoiceHistoryDetail.quantity')}</ProductHead>
          </FlexItem>
          <FlexItem textAlignLocation={textAlign} {...itemStyle.default}>
            <ProductHead>{b3Lang('invoiceHistoryDetail.extendedPrice')}</ProductHead>
          </FlexItem>
        </Flex>
      )}

      {products.map((product) => {
        return (
          <Flex isHeader isMobile={isMobile}>
            <FlexItem padding={isMobile ? '0' : '0 6% 0 0'}>
              <Box
                sx={{
                  marginLeft: '16px',
                }}
              >
                <Typography
                  variant="body1"
                  color="#212121"
                >
                  {product.name}
                </Typography>
                <Typography variant="body1" color="#616161">
                  {product.sku}
                </Typography>
              </Box>
            </FlexItem>

            <FlexItem
              textAlignLocation={textAlign}
              {...itemStyle.default}
              sx={
                isMobile
                  ? {
                      fontSize: '14px',
                    }
                  : {}
              }
            >
              <>
                {isMobile && <span>Unit Price: </span>}
                {formatPrice(product.unitPrice)}
              </>
            </FlexItem>
            <FlexItem
              textAlignLocation={textAlign}
              {...itemStyle.qty}
              sx={
                isMobile
                  ? {
                      fontSize: '14px',
                    }
                  : {}
              }
            >
              <>
                {isMobile && <span>Unit Size: </span>}
                {product.unitSize}
              </>
            </FlexItem>
            <FlexItem
              textAlignLocation={textAlign}
              {...itemStyle.qty}
              sx={
                isMobile
                  ? {
                      fontSize: '14px',
                    }
                  : {}
              }
            >
              <>
                {isMobile && <span>Unit Name: </span>}
                {product.unitName}
              </>
            </FlexItem>
            <FlexItem
              textAlignLocation={textAlign}
              {...itemStyle.qty}
              sx={
                isMobile
                  ? {
                      fontSize: '14px',
                    }
                  : {}
              }
            >
              <>
                {isMobile && <span>Qty: </span>}
                {product.quantity}
              </>
            </FlexItem>
            <FlexItem
              textAlignLocation={textAlign}
              {...itemStyle.default}
              sx={
                isMobile
                  ? {
                      fontSize: '14px',
                    }
                  : {}
              }
            >
              <>
                {isMobile && <span>Extended Price: </span>}
                {formatPrice(product.extendedPrice)}
              </>
            </FlexItem>
          </Flex>
        );
      })}
    </Box>
  ) : null;
}
