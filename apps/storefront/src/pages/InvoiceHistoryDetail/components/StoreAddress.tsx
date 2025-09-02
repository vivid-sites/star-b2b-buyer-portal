import { useEffect, useState } from 'react';
import { getStoreAddress } from '@/shared/service/bc';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function StoreAddress() {
	const [storeAddressLines, setStoreAddressLines] = useState<string[]>([]);
	const [storeName, setStoreName] = useState<string>('');

	useEffect(() => {
		const fetchStoreAddress = async () => {
			const {
				data: {
					site: {
						settings: {
							contact: {
								address
							},
							storeName
						}
					},
				},
			} = await getStoreAddress()
			setStoreAddressLines(address.split('\n'));
			setStoreName(storeName);
		}
		fetchStoreAddress();
	}, []);

	return (
		<Stack 
			direction={{ xs: 'column', md: 'row' }}
			spacing={2}
			sx={{width: '100%'}}
		>
			<Card sx={{ flex: '1 1 50%' }}>
				<CardContent>
					<Box
					sx={{
						wordBreak: 'break-word',
						color: 'rgba(0, 0, 0, 0.87)',
					}}
					>
						<Typography variant="subtitle1">&nbsp;</Typography>
						<Typography
							variant="h6"
							sx={{
							fontWeight: '400',
							}}
						>
							{storeName}
						</Typography>
						{storeAddressLines.map((line, idx) => (
						<Typography
							variant="h6"
							key={`store-address-line-${idx}`}
							sx={{
							fontWeight: '400',
							}}
						>
								{line}
						</Typography>
						))}
					</Box>
				</CardContent>
			</Card>
			<Card sx={{ flex: '1 1 50%' }}>
				<CardContent>
					<Box
					sx={{
						wordBreak: 'break-word',
						color: 'rgba(0, 0, 0, 0.87)',
					}}
					>
						<Typography variant="subtitle1">
							Please Remit To:
						</Typography>
						<Typography
							variant="h6"
							sx={{
								fontWeight: '400',
							}}
						>
							{storeName}
						</Typography>
						{storeAddressLines.map((line, idx) => (
						<Typography
							variant="h6"
							key={`store-remit-line-${idx}`}
							sx={{
								fontWeight: '400',
							}}
						>
							{line}
						</Typography>
						))}
					</Box>
				</CardContent>
			</Card>
		</Stack>
	);
}