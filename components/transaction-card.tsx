"use client";

import Link from "next/link";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import Blockie from "@/components/blockie";
import { highlightMatchingChars } from "@/lib/psned";
import { ExternalLink } from "lucide-react";
import { PsnCheckResult } from "@/hooks/use-psn-check";
import { cn } from "@/lib/utils";

export default function TransactionCard({
	tx,
	address,
}: { tx: PsnCheckResult["flaggedTxs"][0]; address: string }) {
	return (
		<Card
			key={tx.txid}
			className={cn(
				tx.type === "out" && "border-purple-700 dark:border-purple-500",
			)}
		>
			<CardHeader className="flex justify-between items-center gap-2">
				<div className="flex flex-col gap-1">
					<p className="font-semibold">
						You {tx.type === "in" ? "Received" : "Sent"}
					</p>
					{tx.blockTime && (
						<span className="text-sm text-muted-foreground font-normal">
							{new Date(tx.blockTime * 1000).toLocaleString()}
						</span>
					)}
				</div>
				<span className="text-sm text-muted-foreground">
					{tx.type === "in" ? "Targeted" : "Poisoned"}
				</span>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="w-fit flex items-center gap-2">
						<Link
							href={`https://mempool.space/address/${tx.potentialAttackerAddress}`}
							target="_blank"
							className="underline"
						>
							<Blockie
								address={tx.potentialAttackerAddress}
								size={9}
								scale={5}
							/>
						</Link>
						<div className="flex flex-col">
							<span className="text-sm font-medium">
								&#x25A0; {tx.blockHeight}
							</span>
							<p
								dangerouslySetInnerHTML={{
									__html: highlightMatchingChars(
										tx.potentialAttackerAddress,
										address || "",
									),
								}}
								className="text-xs"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						{tx.type === "in" ? (
							<p className="text-base font-medium text-green-700 dark:text-green-500">
								+ {tx.value / 100000000} BTC
							</p>
						) : (
							<p className="text-base font-medium text-red-700 dark:text-red-500">
								- {tx.value / 100000000} BTC
							</p>
						)}
						<p className="flex items-center gap-1 text-sm font-normal">
							<Link
								href={`https://mempool.space/tx/${tx.txid}`}
								target="_blank"
								className="underline"
							>
								View transaction
							</Link>{" "}
							<ExternalLink className="w-3.5 h-3.5" />{" "}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
