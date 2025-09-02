import { Box, Card, CardContent, Divider, styled, Typography } from "@mui/material";

import { InvoiceSummary, MoneyFormat } from "@/types";
import { displayFormat } from '@/utils/b3DateFormat';
import { currencyFormat, ordersCurrencyFormat } from '@/utils';
import { Fragment } from "react/jsx-runtime";
import { useB3Lang } from "@/lib/lang";

interface ItemContainerProps {
	nameKey: string;
}

const ItemContainer = styled('div')((props: ItemContainerProps) => ({
	display: 'flex',
	justifyContent: 'space-between',
	fontWeight: props.nameKey === 'grandTotal' ? 700 : 400,

	'& p': {
		marginTop: 0,
		marginBottom: props.nameKey === 'grandTotal' ? '0' : '12px',
		lineHeight: 1,
	},
}));
  
interface InvoiceSummaryProps {
	invoiceSummary: InvoiceSummary;
	money?: MoneyFormat;
}

export default function InvoiceSummaryCard({ invoiceSummary, money }: InvoiceSummaryProps) {

	const b3Lang = useB3Lang();

	const formatDate = (date: string) => {
		const timestamp = new Date(date).getTime()/1000;
		const epoch = new Date(1970,0,1,0,0,0,0).getTime()/1000;
		return `${displayFormat(Number(timestamp - epoch))}`;
	  }
	
	return (
		<Card
		sx={{
		  marginBottom: '1rem',
		}}
	  >
		<Box
		  sx={{
			padding: '1rem 1rem 0 1rem',
		  }}
		>
		  <Typography variant="h5">Summary</Typography>
		</Box>
		<CardContent>
		  <Box
			sx={{
			  '& .item-name-key': {
				maxWidth: '70%',
				wordBreak: 'break-word',
			  },
			}}
		  >
			{invoiceSummary?.orderDate && <Fragment key="orderDate">
			  <ItemContainer key="orderDate" nameKey="orderDate" aria-label="orderDate" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.orderDate")}</p>
				<p>{formatDate(invoiceSummary?.orderDate)}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.poNumber && <Fragment key="poNumber">
			  <ItemContainer key="poNumber" nameKey="poNumber" aria-label="poNumber" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.purchaseOrderNumber")}</p>
				<p style={{textAlign: 'right'}}>{invoiceSummary?.poNumber}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.invoiceDate && <Fragment key="invoiceDate">
			  <ItemContainer key="invoiceDate" nameKey="invoiceDate" aria-label="invoiceDate" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.invoiceDate")}</p>
				<p>{formatDate(invoiceSummary?.invoiceDate)}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.orderNumber && <Fragment key="orderNumber">
			  <ItemContainer key="orderNumber" nameKey="orderNumber" aria-label="orderNumber" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.orderNumber")}</p>
				<p>{invoiceSummary?.orderNumber}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.pickTicketNumber && <Fragment key="pickTicketNumber">
			  <ItemContainer key="pickTicketNumber" nameKey="pickTicketNumber" aria-label="pickTicketNumber" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.pickTicketNumber")}</p>
				<p>{invoiceSummary?.pickTicketNumber}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.salesTax && <Fragment key="salesTax">
			  <ItemContainer key="salesTax" nameKey="salesTax" aria-label="salesTax" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.salesTax")}</p>
				<p>{money ? ordersCurrencyFormat(money, invoiceSummary?.salesTax) : currencyFormat(invoiceSummary?.salesTax)}</p>
			  </ItemContainer>
			</Fragment>}
			{invoiceSummary?.freight && <Fragment key="freight">
			  <ItemContainer key="freight" nameKey="freight" aria-label="freight" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.freight")}</p>
				<p>{money ? ordersCurrencyFormat(money, invoiceSummary?.freight) : currencyFormat(invoiceSummary?.freight)}</p>
			  </ItemContainer>
			</Fragment>}
			<Divider
			  sx={{
				marginBottom: '1rem',
				marginTop: '0.5rem',
			  }}
			/>
			{invoiceSummary?.invoiceValue && <Fragment key="grandTotal">
			  <ItemContainer key="grandTotal" nameKey="grandTotal" aria-label="grandTotal" role="group">
				<p className="item-name-key">{b3Lang("invoiceHistoryDetail.grandTotal")}</p>
				<p>{money ? ordersCurrencyFormat(money, invoiceSummary?.invoiceValue) : currencyFormat(invoiceSummary?.invoiceValue)}</p>
			  </ItemContainer>
			</Fragment>}
		  </Box>
		</CardContent>
	  </Card>
	)
}