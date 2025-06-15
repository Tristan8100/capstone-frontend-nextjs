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

export function AddCourse() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Add Course</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Enter the Course name and Institute. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" placeholder="Enter Course name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="institute-1">Institute</Label>
              <select id="institute-1" name="institute" className="input">
                <option value="MIT">Massachusetts Institute of Technology</option>
                <option value="Harvard">Harvard University</option>
                <option value="Stanford">Stanford University</option>
                <option value="Oxford">University of Oxford</option>
                <option value="Caltech">California Institute of Technology</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}