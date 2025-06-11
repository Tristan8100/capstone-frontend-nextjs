'use client'
import AlumniLayout from "@/components/layout/alumni-layout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useRef, useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImagePlus, Send, X } from "lucide-react"
export default function Page() {
    const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const urls = Array.from(files).map(file => URL.createObjectURL(file))
    setPreviews(urls)
  }

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <AlumniLayout currentPage="Create Post">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Post</h1>
        <p className="text-muted-foreground">Share your thoughts, photos, and updates with the alumni community.</p>
      </div>
      <Separator className="my-4" />

      <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-md border-muted bg-background">
        <CardHeader>
            <h3 className="text-xl font-semibold text-foreground">Create Post</h3>
        </CardHeader>

        <CardContent>
            <Textarea
            placeholder="What's on your mind?"
            className="resize-none min-h-[100px] bg-muted/20"
            />

            {/* Image Previews */}
            {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
                {previews.map((src, index) => (
                <div
                    key={index}
                    className="relative w-full aspect-square rounded overflow-hidden bg-muted"
                >
                    <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                    />
                    <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-background text-foreground p-0.5 rounded-full shadow"
                    >
                    <X className="w-4 h-4" />
                    </button>
                </div>
                ))}
            </div>
            )}

            <div className="mt-4">
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
            >
                <ImagePlus className="w-4 h-4" />
                Add Photos
            </Button>
            </div>
        </CardContent>

        <CardFooter className="justify-end">
            <Button className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Post
            </Button>
        </CardFooter>
        </Card>

     </AlumniLayout>
  )
}