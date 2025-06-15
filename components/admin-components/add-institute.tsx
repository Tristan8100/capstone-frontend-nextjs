import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddInstitute() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Institute</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Institute</DialogTitle>
            <DialogDescription>
              Enter the Institute name and id. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" placeholder="Enter Institute name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="id-1">ID</Label>
              <Input id="id-1" name="id" placeholder="Enter Institute ID" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="date-created-1">Date Created</Label>
              <Input
                id="date-created-1"
                name="dateCreated"
                placeholder="Enter Date Created"
                type="date"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Institute</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
