
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col items-center bg-background p-8">
            <h1 className="text-6xl font-bold text-primary">Welcome to Try1</h1>
            <p className="text-2xl text-muted-foreground mt-4">
                A platform to help you try out new things
            </p>
            <div className="flex gap-4 mt-8">
                <Link href='/try1'>
                    <Button variant="outline">Try1</Button>
                </Link>
                <Link href='/try2'>
                    <Button variant="outline">Try2</Button>
                </Link>
                <Link href='/try3'>
                    <Button variant="outline">Try3</Button>
                </Link>
            </div>
        </div>
    );
}

