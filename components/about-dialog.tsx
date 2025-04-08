import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function AboutDialog({
	children,
}: { children: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild className="cursor-pointer">
				{children}
			</DialogTrigger>
			<DialogContent className="sm:min-w-[600px] md:min-w-[700px]">
				{/* <DialogHeader> */}
				<DialogTitle className="text-left">About</DialogTitle>
				<div className="text-left space-y-2 text-pretty">
					<p>
						Have I Been Psned is a tool that allows you to check if your BTC
						address has been targeted and victimized by an address poisoning
						attack.
					</p>
					<p>
						First, it checks for any dust transactions sent to your address from
						addresses that look eerily similar to your own. If any such
						transaction is found, the transaction is flagged as "Targeted".
					</p>
					<p>
						Next, it checks if you have sent any payments to any of the attacker
						addresses. If you have, your address is flagged as "Poisoned".
					</p>
					<p>
						Finally, a toxicology report is generated. This includes a list of
						all transactions that have been flagged as "Targeted" or "Poisoned"
						along with transaction details and relevant links.
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
				{/* </DialogHeader> */}
				{/* <DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
