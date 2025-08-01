
import Link from "next/link"
import Image from "next/image"

export default function AuthTemplate({children}: {children?: React.ReactNode}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image src="/static/TSBA Logo.png" alt="" width={24} height={24} />
            </div>
            BTECHLINK
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/static/alumni5.jpg"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full dark:brightness-[0.5] brightness-[0.7]"
        />
      </div>
    </div>
  )
}
