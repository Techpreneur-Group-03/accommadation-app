import { useState } from "react"
import { format } from "date-fns"
import {
  BedDouble,
  Building2,
  DoorOpen,
  Eye,
  House,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { Link } from "react-router-dom"

import { brandActionClassName } from "@/components/field-styles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOwnerHouses } from "@/hooks/use-owner-houses"
import { formatPrice } from "@/lib/utils"
import { DeleteListingDialog } from "@/sections/owner/delete-listing-dialog"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OwnerPanel,
  PanelHeader,
  StatCard,
} from "@/sections/owner/owner-panel"
import { PagePagination } from "@/sections/owner/page-pagination"
import {
  availableRooms,
  coverImage,
  priceFrom,
  type OwnerHouse,
} from "@/services/listings"

const PAGE_SIZE = 10

function ListingStatus({ house }: { house: OwnerHouse }) {
  if (!house.isPublished) return <Badge variant="secondary">Hidden</Badge>
  if (availableRooms(house).length === 0) {
    return (
      <Badge
        className="bg-orange-100 text-orange-700"
        title="All rooms are occupied, so customers can't see it"
      >
        Full
      </Badge>
    )
  }
  return <Badge className="bg-brand/15 text-brand">Published</Badge>
}

export function DashboardPage() {
  const { data: houses, error, isLoading, reload } = useOwnerHouses()
  const [page, setPage] = useState(1)
  const [houseToDelete, setHouseToDelete] = useState<OwnerHouse | null>(null)

  const allHouses = houses ?? []
  const rooms = allHouses.flatMap((house) => house.rooms)
  const freeRooms = rooms.filter((room) => room.isAvailable).length
  const publishedCount = allHouses.filter((house) => house.isPublished).length

  const pageCount = Math.max(1, Math.ceil(allHouses.length / PAGE_SIZE))
  // Stay on a valid page after deleting the last listing of a page.
  const currentPage = Math.min(page, pageCount)
  const pageHouses = allHouses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <StatCard
          label="My Listings"
          value={isLoading ? "–" : allHouses.length}
          hint={isLoading ? undefined : `${publishedCount} published`}
          icon={House}
        />
        <StatCard
          label="Total Rooms"
          value={isLoading ? "–" : rooms.length}
          icon={BedDouble}
        />
        <StatCard
          label="Available Rooms"
          value={isLoading ? "–" : freeRooms}
          hint={isLoading ? undefined : `${rooms.length - freeRooms} occupied`}
          icon={DoorOpen}
        />
      </div>

      <OwnerPanel>
        <PanelHeader
          title="My Listings"
          description="Manage all the houses you have listed."
          actions={
            <Button
              render={<Link to="/admin/listings/new" />}
              nativeButton={false}
              className={brandActionClassName}
            >
              <Plus />
              Add Listing
            </Button>
          }
          className="border-b pb-6"
        />

        {isLoading ? (
          <LoadingState label="Loading your listings..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : allHouses.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Add your first house so customers can find it."
            action={
              <Button
                render={<Link to="/admin/listings/new" />}
                nativeButton={false}
                className={brandActionClassName}
              >
                <Plus />
                Add Listing
              </Button>
            }
          />
        ) : (
          <>
            <Table className="mt-6">
              <TableHeader className="bg-muted/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">House</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Start From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead className="pr-4 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageHouses.map((house) => {
                  const cover = coverImage(house)
                  const price = priceFrom(house)
                  return (
                    <TableRow key={house.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          {cover ? (
                            <img
                              src={cover.url}
                              alt=""
                              className="h-9 w-12 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                              <ImageOff className="size-4 text-muted-foreground" />
                            </span>
                          )}
                          <span className="max-w-56 truncate font-medium">
                            {house.houseName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground">
                        {house.location}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {availableRooms(house).length} / {house.rooms.length}{" "}
                        free
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {price === null ? "–" : `${formatPrice(price)} / month`}
                      </TableCell>
                      <TableCell>
                        <ListingStatus house={house} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(house.updatedAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`View ${house.houseName}`}
                            render={<Link to={`/admin/listings/${house.id}`} />}
                            nativeButton={false}
                          >
                            <Eye />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${house.houseName}`}
                            className="text-brand hover:text-brand"
                            render={
                              <Link to={`/admin/listings/${house.id}/edit`} />
                            }
                            nativeButton={false}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${house.houseName}`}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setHouseToDelete(house)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <PagePagination
              page={currentPage}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </OwnerPanel>

      <DeleteListingDialog
        house={houseToDelete}
        onOpenChange={(open) => {
          if (!open) setHouseToDelete(null)
        }}
        onDeleted={reload}
      />
    </div>
  )
}

export default DashboardPage
