import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/providers";
import Header from "@/components/ui/header";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Have I Been Psned?",
	description: "Check if your Bitcoin address has been poisoned",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh]`}
		>
			<body>
				<Providers>
					<div className="mx-auto px-4 w-full">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
