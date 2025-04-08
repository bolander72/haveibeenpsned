import MatrixCode from "@/components/ui/matrix-code";
import { PsnCheckResult } from "@/hooks/use-psn-check";
type Status = "poisoned" | "clean" | "targeted";

interface Props {
	status: Status;
	flaggedTxs: PsnCheckResult["flaggedTxs"];
}

export default function ToxicologyHero({ status, flaggedTxs = [] }: Props) {
	const getStatusConfig = () => {
		switch (status) {
			case "poisoned":
				return {
					text: "POISONED",
					color: "#8b5cf6",
					gradient: "from-purple-400 via-violet-500 to-purple-600",
					textColor: "text-purple-500",
				};
			case "clean":
				return {
					text: "CLEAN",
					color: "#22c55e",
					gradient: "from-green-400 via-emerald-500 to-green-600",
					textColor: "text-green-500",
				};
			case "targeted":
				return {
					text: "TARGETED",
					color: "#f97316",
					gradient: "from-orange-400 via-amber-500 to-orange-600",
					textColor: "text-orange-500",
				};
		}
	};

	const config = getStatusConfig();

	return (
		<div className="absolute inset-0 z-50 transition-opacity duration-1000">
			<div className="h-full w-full">
				<MatrixCode
					fontSize={20}
					color={config.color}
					characters="01"
					fadeOpacity={0.1}
					speed={1.0}
				/>
				<div className="h-full w-full flex items-center justify-center">
					<div className="relative mx-4 space-y-2">
						<h1
							className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}
						>
							{config.text}
						</h1>
						<div className="space-y-4 max-w-3xl bg-background p-4 rounded-lg">
							<div className="space-y-2">
								<h3 className="text-2xl font-bold">Toxicology Report</h3>
								<p>
									{flaggedTxs.length === 0
										? "Found 0 targeting transactions and attacks for your address"
										: `Psned by ${flaggedTxs.filter((tx) => tx.type === "out").length} attacker${flaggedTxs.filter((tx) => tx.type === "out").length === 1 ? "" : "s"} and found ${flaggedTxs.filter((tx) => tx.type === "in").length} targeted dust transaction${flaggedTxs.filter((tx) => tx.type === "in").length === 1 ? "" : "s"} to you`}
								</p>
								<p>
									{flaggedTxs
										.filter((tx) => tx.type === "out")
										.reduce(
											(acc, tx) => (acc + tx.value) / 100_000_000,
											0,
										)}{" "}
									BTC lost
								</p>
								<p className="text-xs text-muted-foreground text-pretty">
									The toxicology report is a list of transactions that have been
									flagged for suspicious activity. "Targeted" transactions
									consist of dust payments sent from vanity copycat addresses
									created by attackers to confuse a victim. Your address is
									flagged as "Poisoned" if you sent any payments to any of these
									attacker addresses.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
