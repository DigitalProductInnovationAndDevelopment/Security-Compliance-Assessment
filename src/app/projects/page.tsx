import { getServerAuthSession } from '~/server/auth';
import Unauthorised from '~/components/unauthorised';


export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <div className='flex min-h-96 flex-col items-center justify-center'>
        <div className='container flex flex-col items-center justify-center text-center'>
          <Unauthorised />
        </div>
      </div>
    )
  }
  return (
    <div className='px-6'>Projects</div>
  )
}
