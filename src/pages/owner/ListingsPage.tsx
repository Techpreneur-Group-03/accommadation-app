import { Building2, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { brandActionClassName } from "@/components/field-styles"
import { Button } from "@/components/ui/button"
import { useOwnerHouses } from "@/hooks/use-owner-houses"
import { ListingCard } from "@/sections/owner/listing-card"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OwnerPanel,
  PanelHeader,
} from "@/sections/owner/owner-panel"

function AddListingButton() {
  return (
    <Button
      render={<Link to="/admin/listings/new" />}
      nativeButton={false}
      className={brandActionClassName}
    >
      <Plus />
      Add Listing
    </Button>
  )
}

export function ListingsPage() {
  const { data: houses, error, isLoading, reload } = useOwnerHouses()

  return (
    <OwnerPanel>
      <PanelHeader
        title="My Listings"
        description="List of all your houses. Open one to see its rooms, edit or delete it."
        actions={<AddListingButton />}
      />

      {isLoading ? (
        <LoadingState label="Loading your listings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !houses || houses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No listings yet"
          description="Add your first house so customers can find it."
          action={<AddListingButton />}
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-x-12">
          {houses.map((house) => (
            <ListingCard key={house.id} house={house} />
          ))}
        </div>
      )}
    </OwnerPanel>
  )
}

export default ListingsPage
