import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { api } from '~/trpc/server'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'


export default async function Page({ params }: Readonly<{ params: { id: string } }>) {
  const areas = await api.refa.areasByStage({ stageNumber: parseInt(params.id) })
  console.log("AREAAAAS", areas)
  // if the link is not something like refa/stages/1 or refa/stages/2
  // redirect to the first stage

  return (
    <div className='relative bg-white w-full min-h-full rounded-lg p-8'>
      <div className='flex flex-wrap gap-4 min-w-full'>
        {areas?.areas.map((area) => (
          <Sheet key={area.area_id}>
            <SheetTrigger>
              <Card title={area.area_name} className='p-2 m-2 min-w-fit'>
                <CardHeader className='flex flex-col items-center justify-center' title={area.area_name}>
                  <CardTitle className='text-center'>{area.area_name}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-sm text-gray-500'>{area.area_id}</p>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className='lg:min-w-[40vw]'>
              <SheetHeader>
                <SheetTitle className='text-center'>
                  <div>Area Details: </div>
                  {area.area_name}
                </SheetTitle>
                <SheetDescription>
                  <div className='flex my-4'>
                    <SheetTitle>People</SheetTitle>
                    <Badge variant={area.people === 'High' ? 'destructive' : area.technology === 'Medium' ? 'secondary' : 'default'} className='ml-2'>{area.people}</Badge>
                  </div>
                  <ul>
                    {area.people_practices.map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))}
                  </ul>
                  <Separator className='my-4' />
                  <div className='flex my-4'>
                    <SheetTitle>Process</SheetTitle>
                    <Badge variant={area.process === 'High' ? 'destructive' : area.technology === 'Medium' ? 'secondary' : 'default'} className='ml-2'>{area.process}</Badge>
                  </div>
                  <ul>
                    {area.process_practices.map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))} 
                  </ul>
                  <Separator className='my-4' />
                  <div className='flex my-4'>
                    <SheetTitle>Technology</SheetTitle>
                    <Badge variant={area.technology === 'High' ? 'destructive' : area.technology === 'Medium' ? 'secondary' : 'default'} className='ml-2'>{area.technology}</Badge>
                  </div>
                  <ul>
                    {area.technology_practices.map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))}
                  </ul>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  )
}
