'use client';
import { signIn, signOut } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'

export default function Authenticate({ action, className = "" }: { action?: 'signIn' | 'signOut', className?: string }) {
	if (action === 'signIn') {
		return (
			<Button className={className} onClick={() => signIn('google')}>Sign In</Button>
		)
	} else if (action === 'signOut') {
		return (
			<Button className={className} onClick={() => signOut()}>Sign Out</Button>
		)
	}
}
