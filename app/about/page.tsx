import Link from "next/link";

export default function About() {
	return (
		<div className="text-left space-y-2 text-pretty max-w-3xl mx-auto py-12">
			<h3 className="text-2xl font-bold mb-4">About</h3>
			<p>
				Have I Been Psned is a tool that allows you to check if your BTC address
				has been targeted and victimized by an address poisoning attack.
			</p>
			<p>
				First, it checks for any dust transactions sent to your address from
				addresses that look eerily similar to your own. If any such transaction
				is found, the transaction is flagged as "Targeted".
			</p>
			<p>
				Next, it checks if you have sent any payments to any of the attacker
				addresses. If you have, your address is flagged as "Poisoned".
			</p>
			<p>
				Finally, a toxicology report is generated. This includes a list of all
				transactions that have been flagged as "Targeted" or "Poisoned" along
				with transaction details and relevant links.
			</p>
			<p>
				Note: this is a proof of concept currently using the public{" "}
				<Link
					target="_blank"
					className="underline"
					href="https://mempool.space"
				>
					mempool.space
				</Link>{" "}
				API. To avoid rate limiting, paginated transaction requests are made
				every 2 seconds.
			</p>
			<p>
				Addresses with 1,000+ transactions may fail during toxicology report
				generation due to public API limits.
			</p>
			<p>A fix for this and other features are currently in the works.</p>
			<p>
				Want to contribute? Check out the{" "}
				<Link
					target="_blank"
					className="underline"
					href="https://github.com/bolander72/haveibeenpsned"
				>
					GitHub repo
				</Link>
				.
			</p>
			<p>Inspired by:</p>
			<p>
				<Link
					target="_blank"
					className="underline"
					href="https://haveibeenpwned.com"
				>
					haveibeenpwned.com
				</Link>
			</p>
			<p>
				<Link
					target="_blank"
					className="underline"
					href="https://www.youtube.com/watch?v=TqxDr_SjAgg&t=22980s"
				>
					Jameson Lopp's presentation
				</Link>{" "}
				at the 2025 MIT Bitcoin Expo
			</p>
		</div>
	);
}
