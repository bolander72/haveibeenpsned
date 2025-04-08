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

export default function DonateDialog({
	children,
}: { children: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild className="cursor-pointer">
				{children}
			</DialogTrigger>
			<DialogContent className="sm:min-w-[600px] md:min-w-[700px]">
				{/* <DialogHeader> */}
				<DialogTitle className="text-left">Donate</DialogTitle>
				<div className="text-left space-y-2 text-pretty">
					<p>L1 BTC</p>
					<p className="text-sm">bc1q7kpvqgz4g5v77fqg9njc9xharrlr9pn6453hj6</p>
					<p>Lightning Address</p>
					<p className="text-sm">bolander72@getalby.com</p>
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
