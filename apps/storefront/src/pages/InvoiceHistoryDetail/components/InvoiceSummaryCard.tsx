import { Box, Card, CardContent, Divider, styled, Typography } from "@mui/material";

import { InvoiceSummary, MoneyFormat } from "@/types";
import { displayFormat } from '@/utils/b3DateFormat';
import { currencyFormat, ordersCurrencyFormat } from '@/utils';
import { Fragment } from "react/jsx-runtime";
import { useB3Lang } from "@/lib/lang";
import CustomButton from "@/components/button/CustomButton";
import { throttle } from "lodash";
import { getVSAPIBaseURL } from "@/shared/service/vs/request/base";
import { ensureVSCurrentCustomerJWT } from "@/shared/service/vs/request/jwt";
import { store } from "@/store";

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
  
const StyledCardActions = styled('div')(() => ({
	flexWrap: 'wrap',
	margin: '1rem 0 0 0',
  
	'& button': {
	  marginLeft: '0',
	  marginRight: '8px',
	  margin: '8px 8px 0 0',
	},
}));

const bindDom = (html: string, domId: string) => {
	let iframeDom = document.getElementById(domId) as HTMLIFrameElement | null;
	if (!iframeDom) {
	  iframeDom = document.createElement('iframe');
	  iframeDom.src = 'about:blank';
	  iframeDom.id = domId;
	  iframeDom.style.display = 'none';
	  document.body.appendChild(iframeDom);
	}
	iframeDom.srcdoc = html;
	iframeDom.style.display = 'block';
};

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
	
	async function handlePrintInvoice() {
		const apiBaseUrl = getVSAPIBaseURL();

		await ensureVSCurrentCustomerJWT();
		const { vsCurrentCustomerJWT } = store.getState().company.tokens;
	  
		fetch(`${apiBaseUrl}/storefront/orderhistory/${invoiceSummary?.invoiceNumber}/print`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${vsCurrentCustomerJWT}`,
				},
			}
		)
			.then(response => response.text())
			.then(html => {
				html = html.replace('</head>', `<base href="${apiBaseUrl}" /> </head>`);
				bindDom(html, 'b2b_print_invoice');
			})
			.catch(error => {
				console.error(error);
			});
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
		  {invoiceSummary?.invoiceNumber && <StyledCardActions>
            <Fragment key="printInvoice">
                <CustomButton
                  value={b3Lang("invoiceHistoryDetail.printInvoice")}
                  key="printInvoice"
                  name="printInvoice"
                  variant="outlined"
                  onClick={throttle(() => {
                    handlePrintInvoice();
                  }, 2000)}
                >
                  {b3Lang("invoiceHistoryDetail.printInvoice")}
                </CustomButton>
            </Fragment>
		  </StyledCardActions>}
		</CardContent>
	  </Card>
	)
}