import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteListing, type OwnerHouse } from "@/services/listings"

interface DeleteListingDialogProps {
  // The listing to delete; the dialog is open while this is set.
  house: OwnerHouse | null
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function DeleteListingDialog({
  house,
  onOpenChange,
  onDeleted,
}: DeleteListingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!house) return
    setIsDeleting(true)
    try {
      await deleteListing(house)
      toast.success(`"${house.houseName}" was deleted`)
      onOpenChange(false)
      onDeleted()
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete the listing"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog
      open={house !== null}
      onOpenChange={(open) => {
        if (!isDeleting) onOpenChange(open)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{house?.houseName}&quot; will be removed with all its rooms
            and photos. Customers won&apos;t see it anymore. This can&apos;t be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting && <LoaderCircle className="animate-spin" />}
            Delete listing
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteListingDialog
