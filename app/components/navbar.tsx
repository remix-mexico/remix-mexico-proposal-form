import {
	DiscordLogoIcon,
	GitHubLogoIcon,
	GlobeIcon,
	HamburgerMenuIcon
} from '@radix-ui/react-icons';
import { Button, buttonVariants } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Link } from '@remix-run/react';
import { cn } from '~/lib/utils';

export function Navbar() {
	return (
		<nav className='container fixed inset-x-0 top-0 flex flex-row items-center justify-between py-8'>
			<Link
				to='/'
				className='flex scroll-m-20 gap-x-2 text-xl font-semibold tracking-tight lg:text-2xl'
			>
				Remix México
				<span role='img' aria-label='Mexico flag'>
					🇲🇽
				</span>
			</Link>
			<div className='lg:hidden'>
				<MobileMenu />
			</div>
			<div className='hidden gap-x-10 lg:flex'>
				{socials.map(social => (
					<Link
						key={social.name}
						to={social.href}
						className={cn(
							'flex items-center gap-x-2',
							buttonVariants({ variant: 'link' })
						)}
						target='_blank'
					>
						<social.icon className='h-4 w-4' />
						{social.name}
					</Link>
				))}
			</div>
		</nav>
	);
}

function MobileMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost'>
					<HamburgerMenuIcon className='h-5 w-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent collisionPadding={32}>
				{socials.map(social => (
					<DropdownMenuItem key={social.name} asChild>
						<Link to={social.href} className='flex gap-x-4' target='_blank'>
							<social.icon className='h-4 w-4' /> {social.name}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const socials = [
	{
		name: 'Meetup',
		icon: GlobeIcon,
		href: 'https://www.meetup.com/remix-mexico'
	},
	{
		name: 'Discord',
		icon: DiscordLogoIcon,
		href: 'https://discord.gg/KaTsd6Fr'
	},
	{
		name: 'Github',
		icon: GitHubLogoIcon,
		href: 'https://github.com/remix-mexico'
	}
];
