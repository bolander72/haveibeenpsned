import { PsnForm } from "@/components/psn-form";

export default async function Home() {
	return (
		<div className="flex flex-col gap-12 my-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-center">Have I been psned?</h1>
				<p className="text-center text-lg text-muted-foreground hidden md:block">
					Check if your BTC address has been targeted by an address poisoning
					attack
				</p>
				<p className="text-center text-lg text-muted-foreground block md:hidden">
					BTC address poisoning attack checker
				</p>
			</div>
			<PsnForm />
		</div>
	);
}
