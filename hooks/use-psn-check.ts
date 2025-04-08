import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSimilarityScore, isSuspiciousOutput } from "@/lib/psned";

interface Transaction {
	txid: string;
	status?: {
		confirmed: boolean;
		block_height?: number;
		block_time?: number;
	};
	firstSeen?: number;
	fee: number;
	vin: Array<{
		prevout?: {
			scriptpubkey_address?: string;
		};
	}>;
	vout: Array<{
		scriptpubkey_address: string;
		value: number;
	}>;
}

export interface PsnCheckResult {
	address: string;
	confirmedTxCount: number;
	mempoolTxCount: number;
	flaggedTxs: Array<{
		txid: string;
		value: number;
		blockHeight?: number;
		blockTime?: number;
		fee: number;
		potentialAttackerAddress: string;
		similarityScore?: number;
		type: "in" | "out";
	}>;
	lastChecked: string;
}

async function fetchAllMempoolTxs(address: string): Promise<Transaction[]> {
	let allTxs: Transaction[] = [];
	let lastSeenTxid: string | undefined = undefined;
	let keepGoing = true;

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	while (keepGoing) {
		const url: string = lastSeenTxid
			? `https://mempool.space/api/address/${address}/txs?after_txid=${lastSeenTxid}`
			: `https://mempool.space/api/address/${address}/txs`;

		const res: Response = await fetch(url);
		const txs: Transaction[] = await res.json();

		if (txs.length === 0) {
			keepGoing = false;
		} else {
			allTxs.push(...txs);
			lastSeenTxid = txs[txs.length - 1].txid;
			await sleep(2000); // Add 500ms delay between calls
		}
	}

	return allTxs;
}

export function usePsnCheck() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (address: string) => {
			const txs = await fetchAllMempoolTxs(address);

			// Process transactions
			const mempoolTxs = txs.filter((tx) => !tx.status?.confirmed);
			const confirmedTxs = txs.filter((tx) => tx.status?.confirmed);

			const flaggedTxs: PsnCheckResult["flaggedTxs"] = [];

			// First pass: Identify suspicious transactions and potential attackers
			for (const tx of txs) {
				for (const vout of tx.vout) {
					if (vout.scriptpubkey_address === address) {
						if (isSuspiciousOutput(vout.value)) {
							const sender = tx.vin[0]?.prevout?.scriptpubkey_address;
							if (!sender) continue;

							const txData = {
								txid: tx.txid,
								value: vout.value,
								blockHeight: tx.status?.block_height,
								blockTime: tx.status?.block_time,
								fee: tx.fee,
								potentialAttackerAddress: sender,
								type: "in" as const,
							};

							const similarityScore = getSimilarityScore(address, sender);
							if (similarityScore > 0.12 && sender !== address) {
								flaggedTxs.push({ ...txData, similarityScore });
							}
						}
					}
				}
			}

			// Second pass: Check for transactions to attackers
			for (const tx of txs) {
				const isFromUser = tx.vin[0]?.prevout?.scriptpubkey_address === address;
				if (isFromUser) {
					for (const vout of tx.vout) {
						if (
							flaggedTxs.some(
								(tx) =>
									tx.potentialAttackerAddress === vout.scriptpubkey_address,
							)
						) {
							flaggedTxs.push({
								txid: tx.txid,
								potentialAttackerAddress: vout.scriptpubkey_address,
								value: vout.value,
								blockHeight: tx.status?.block_height,
								blockTime: tx.status?.block_time,
								fee: tx.fee,
								type: "out",
							});
						}
					}
				}
			}

			const result: PsnCheckResult = {
				address,
				confirmedTxCount: confirmedTxs.length,
				mempoolTxCount: mempoolTxs.length,
				flaggedTxs,
				lastChecked: new Date().toISOString(),
			};

			return result;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["psned", data.address], data);
		},
	});
}
