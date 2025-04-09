import { PsnForm } from "@/components/psn-form";

export default async function Home() {
	return (
		<div className="flex flex-col gap-12 my-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-center">Have I been psned?</h1>
				<p className="text-center text-lg text-muted-foreground hidden sm:block">
					Detect address poisoning attacks on your BTC
				</p>
				<p className="text-center text-base text-muted-foreground block sm:hidden">
					Detect address poisoning attacks on your BTC
				</p>
			</div>
			<PsnForm />
		</div>
	);
}
