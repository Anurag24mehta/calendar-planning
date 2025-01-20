"use client"
import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {fullNameValidation} from "@/schemas/onboardingSchema";
import {useEdgeStore} from "@/lib/edgestore";
import {SingleImageDropzone} from "@/components/ui/SingleImageDropzone";
import {useToast} from "@/hooks/use-toast";

const formSchema = z.object({
    fullName: fullNameValidation,
});

interface SettingsFormProps {
    fullName: string,
    image: string
    email: string
}

export function SettingsForm({fullName, image, email}: SettingsFormProps) {
    const {toast} = useToast();

    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),

    })
    // initializing edgestore for file upload
    const { edgestore } = useEdgeStore();
    
    //use state for file
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState<'PENDING' | 'COMPLETE' | 'ERROR' | number>('PENDING');
    const [uploadRes, setUploadRes] = useState<{
        url: string;
        filename: string;
    }>();

//overall form submit functionality
    async function onSubmit(values: z.infer < typeof formSchema > ) {
        try {
            console.log(values);
            if(uploadRes){
                const result = await fetch("/api/settings",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: values.fullName,
                        image : uploadRes.url
                    }),
                })
                const {status} = await result.json();
                if (status == 200) {
                    toast({
                        title: "Success",
                        description: "Profile updated successfully",
                    })
                    window.location.reload();

                }else{
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Something went wrong",
                    })
                }
            }else{
                const res = await fetch("/api/settings",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: values.fullName,
                        image: image
                    }),
                })
                const {status} = await res.json();
                if (status == 200) {
                    toast({
                        title: "Success",
                        description: "Profile updated successfully",
                    })
                    window.location.reload();

                }else{
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Oops! Something went wrong from our side try again",
                    })
                }
            }

        } catch (error) {
            console.error("Form submission error", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Oops! Something went wrong try again",
            })
        }
    }

//image upload submit functionality
    const onImageUpload = async () => {
        if (file) {
            try{
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: async (newProgress) => {
                        setProgress(newProgress);
                        if (newProgress === 100) {
                            // wait 1 second to set it to complete
                            // so that the user can see it at 100%
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            setProgress('COMPLETE');
                        }
                    },
                });
                setUploadRes({
                    url: res.url,
                    filename: file.name,
                });
                console.log(res.url);
            }catch(error){
                setProgress("ERROR");
                console.error(error);
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={fullName}

                                    type=""
                                    {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                <Input disabled={true} placeholder={"email"} value={email}/>

                <div className="flex flex-col items-center">
                    <SingleImageDropzone
                        height={200}
                        width={200}
                        value={file}
                        onChange={setFile}
                        disabled={progress !== 'PENDING'}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 4, // 4 MB
                        }}
                    />
                    <Button
                        className="mt-2"
                        onClick={onImageUpload}
                        disabled={!file || progress !== 'PENDING'}
                    >
                        {progress === 'PENDING'
                            ? 'Upload'
                            : progress === 'COMPLETE'
                                ? 'Done'
                                : typeof progress === 'number'
                                    ? `Uploading (${Math.round(progress)}%)`
                                    : 'Error'}
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
)
}