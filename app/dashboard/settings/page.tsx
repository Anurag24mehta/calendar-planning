import {SettingsForm} from "@/components/SettingsForm";
import prisma from "@/app/lib/db";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/app/lib/auth";

async function getData(id:string){
    const data = prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            name: true,
            email: true,
            image: true,
        }
    })
    if(!data) {
        return notFound()
    }else{
        return data
    }
}


export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        return redirect("/");
    }
    const data = await getData(session.user?.id as string);

    return(
        <SettingsForm
            email={data?.email as string}
            fullName={data?.name as string}
            image={data?.image as string}/>
    )
}


//
// 'use client';
//
// import { Button } from '@/components/ui/button';
// import { SingleImageDropzone } from '@/components/ui/SingleImageDropzone';
// import { useEdgeStore } from '@/lib/edgestore';
// import { useState } from 'react';
//
// export default function Page() {
//     return (
//         <SingleImageExample/>
//     );
// }
//
// function SingleImageExample() {
//     const [file, setFile] = useState<File>();
//     const [progress, setProgress] = useState<
//         'PENDING' | 'COMPLETE' | 'ERROR' | number
//     >('PENDING');
//     const [uploadRes, setUploadRes] = useState<{
//         url: string;
//         filename: string;
//     }>();
//     const { edgestore } = useEdgeStore();
//
//     return (
//         <div className="flex flex-col items-center">
//             <SingleImageDropzone
//                 height={200}
//                 width={200}
//                 value={file}
//                 onChange={setFile}
//                 disabled={progress !== 'PENDING'}
//                 dropzoneOptions={{
//                     maxSize: 1024 * 1024 * 1, // 1 MB
//                 }}
//             />
//             <Button
//                 className="mt-2"
//                 onClick={async () => {
//                     if (file) {
//                         try {
//                             const res = await edgestore.publicFiles.upload({
//                                 file,
//                                 onProgressChange: async (newProgress) => {
//                                     setProgress(newProgress);
//                                     if (newProgress === 100) {
//                                         // wait 1 second to set it to complete
//                                         // so that the user can see it at 100%
//                                         await new Promise((resolve) => setTimeout(resolve, 1000));
//                                         setProgress('COMPLETE');
//                                     }
//                                 },
//                             });
//                             setUploadRes({
//                                 url: res.url,
//                                 filename: file.name,
//                             });
//                             console.log(res.url);
//                         } catch (err) {
//                             setProgress('ERROR');
//                         }
//                     }
//                 }}
//                 disabled={!file || progress !== 'PENDING'}
//             >
//                 {progress === 'PENDING'
//                     ? 'Upload'
//                     : progress === 'COMPLETE'
//                         ? 'Done'
//                         : typeof progress === 'number'
//                             ? `Uploading (${Math.round(progress)}%)`
//                             : 'Error'}
//             </Button>
//             {uploadRes && (
//                 <div className="mt-2">
//                     <a
//                         href={uploadRes.url}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="underline"
//                     >
//                         {uploadRes.filename}
//                     </a>
//                 </div>
//             )}
//         </div>
//     );
// }
