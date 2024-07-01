import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const stages = await api.refa.stages()

  return (
    <div className='relative w-full px-6'>
      <div className='flex min-w-full -ml-3'>
        {stages.map((stage) => (
          <div key={stage.name} className='border-gray-200 py-4'>
            <div className='flex flex-row'>
              <span className='inline-flex items-center'>
                <Link href={'/refa/stages/' + stage.stageNumber}>
                  <Button variant={'link'} className='text-md font-medium' >{stage.name}</Button>
                </Link>
              </span>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
