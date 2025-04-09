"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import ToxicologyHero from "@/components/toxicology-hero";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { usePsnCheck } from "@/hooks/use-psn-check";
import TransactionCard from "@/components/transaction-card";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	address: z
		.string()
		.min(26, {
			message: "Address must be at least 26 characters.",
		})
		.max(90, {
			message: "Address must be at most 90 characters.",
		})
		.regex(/^(bc1|[13]|tb1|bcrt1)[a-zA-HJ-NP-Z0-9]{25,90}$/, {
			message:
				"Please enter a valid Bitcoin address (P2PKH, P2SH, Bech32, or Taproot).",
		})
		.refine(
			(val) => {
				// Check for valid Bech32 checksum for bc1/tb1/bcrt1 addresses
				if (
					val.startsWith("bc1") ||
					val.startsWith("tb1") ||
					val.startsWith("bcrt1")
				) {
					try {
						// Basic Bech32 validation
						const hrp = val.startsWith("bc1")
							? "bc"
							: val.startsWith("tb1")
								? "tb"
								: "bcrt";
						const data = val.slice(hrp.length + 1);
						return /^[02-9ac-hj-np-z]+$/.test(data); // Valid Bech32 characters
					} catch {
						return false;
					}
				}
				return true;
			},
			{
				message: "Invalid Bech32 checksum for SegWit address.",
			},
		),
});

export function PsnForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: "bc1qr9xkxanfstzqpfd5ce0t3evwc45pnmsr2wua0h",
		},
	});

	const mutation = usePsnCheck();
	const [showPoisonedEffect, setShowPoisonedEffect] = useState(false);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		mutation.mutate(values.address);
	};

	const hasPoisonedTxs =
		mutation.data?.flaggedTxs.some((tx) => tx.type === "out") ?? false;

	useEffect(() => {
		if (hasPoisonedTxs) {
			setShowPoisonedEffect(true);
		}
	}, [hasPoisonedTxs]);

	return (
		<div className="space-y-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-2 max-w-3xl mx-auto"
				>
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>BTC Address</FormLabel>
								<FormControl className="flex-1">
									<Textarea
										placeholder="bc1qr9xkxanfstzqpfd5ce0t3evwc45pnmsr2wua0h"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{mutation.isPending ? (
						<Button disabled>
							<Loader2 className="animate-spin" />
							Please wait
						</Button>
					) : (
						<Button type="submit">Check</Button>
					)}
				</form>
			</Form>

			{mutation.error && (
				<div className="text-red-500 text-sm">
					Error:{" "}
					{mutation.error instanceof Error
						? mutation.error.message
						: "Failed to fetch data"}
				</div>
			)}

			{mutation.data && (
				<div className="relative flex flex-col justify-center items-center my-12 p-4 h-[450px] -mx-4">
					<ToxicologyHero
						status={
							mutation.data.flaggedTxs.some((tx) => tx.type === "out")
								? "poisoned"
								: mutation.data.flaggedTxs.length > 0 &&
										mutation.data.flaggedTxs.every((tx) => tx.type === "in")
									? "targeted"
									: "clean"
						}
						flaggedTxs={mutation.data.flaggedTxs}
					/>
				</div>
			)}

			{mutation.data && (
				<>
					<div className="space-y-4 max-w-3xl mx-auto">
						{mutation.data.flaggedTxs
							.sort((a, b) => (b.blockTime ?? 0) - (a.blockTime ?? 0))
							.map((tx) => (
								<TransactionCard
									key={tx.txid}
									tx={tx}
									address={form.getValues("address")}
								/>
							))}
					</div>
				</>
			)}
		</div>
	);
}
