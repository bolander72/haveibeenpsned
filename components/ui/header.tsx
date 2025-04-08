"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ExternalLink } from "lucide-react";
import AboutDialog from "@/components/about-dialog";
import DonateDialog from "@/components/donate-dialog";

export default function NavigationMenuDemo() {
	return (
		<div className="w-full max-w-3xl mx-auto flex items-center justify-between min-h-20">
			<Link href="/">
				<img src="/favicon.ico" alt="logo" className="size-10" />
			</Link>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/docs" legacyBehavior passHref>
							<AboutDialog>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									About
								</NavigationMenuLink>
							</AboutDialog>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/docs" legacyBehavior passHref>
							<DonateDialog>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Donate
								</NavigationMenuLink>
							</DonateDialog>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link
							href="https://github.com/bolander72/haveibeenpsned"
							legacyBehavior
							passHref
						>
							<NavigationMenuLink
								className={cn(
									navigationMenuTriggerStyle(),
									"flex items-center gap-1.5",
								)}
								target="_blank"
							>
								Contribute <ExternalLink className="size-3.5" />
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					{/* <NavigationMenuItem>
						<ModeToggle />
					</NavigationMenuItem> */}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
