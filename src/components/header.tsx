'use client'
import Link from 'next/link'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import Image from 'next/image'
import SiemensLogo from '../../public/siemens-logo.png'
import Authenticate from './authenticate'
import { cn } from '~/lib/utils'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'


export default function Header({ session }: { session: Session | null }) {
	const pathname = usePathname();
	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6">
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center w-full md:gap-5 md:text-sm lg:gap-6">
				<Link
					href="#"
					className="flex items-center gap-2 text-lg font-semibold md:text-base w-44 mr-12"
				>
					<Image src={SiemensLogo} height={500} width={500} alt='Siemens Logo' />
					<span className="sr-only">Siemens</span>
				</Link>
				<Link
					href="/projects"
					className={cn(pathname === '/projects' ? 'text-foreground' : 'text-muted-foreground', "transition-colors hover:text-foreground text-md font-semibold")}
				>
					Projects
				</Link>
				<Link
					href="/refa"
					className={cn(pathname === '/refa' ? 'text-foreground' : 'text-muted-foreground', "transition-colors hover:text-foreground text-md font-semibold")}
				>
					Reference Model
				</Link>
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="shrink-0 md:hidden"
					>
						<Menu className="h-5 w-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<Link
							href="/"
							className="flex items-center gap-2 text-lg font-semibold md:text-base w-44 mr-12"
						>
							<Image src={SiemensLogo} height={500} width={500} alt='Siemens Logo' />
							<span className="sr-only">Siemens</span>
						</Link>
						<Link href="/projects" className="hover:text-foreground">
							Projects
						</Link>
						<Link
							href="/refa"
							className="text-muted-foreground hover:text-foreground"
						>
							Reference Model
						</Link>
					</nav>
				</SheetContent>
			</Sheet>
			<div className='flex justify-end w-full'>
				{!session && <Authenticate action='signIn' />}
				{session &&
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="default" size="icon" className="rounded-full">
								{session?.user?.image && <img src={session?.user?.image} alt="User profile" className="rounded-full" />}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem><Authenticate className='bg-none' action='signOut' /></DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			</div>
		</header>
	)
}
