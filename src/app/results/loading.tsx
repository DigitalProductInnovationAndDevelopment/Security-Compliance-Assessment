import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
    return (
        <div className='relative bg-white w-full min-h-full rounded-lg p-8'>
            <div className='flex flex-wrap gap-4 min-w-full'>
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 w-72 m-2" />
                ))}
            </div>
        </div>
    );
}