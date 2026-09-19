import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SearchFilterSection } from "@/sections/search-filter-section";
import { CardListingSection } from "@/sections/CardListingSection";
import Footer from "@/sections/Footer";

export function App() {

  const [tab, setTab] = useState("home");
  return (
    <div>
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        notificationCount={3}
        messageCount={2}
        onNotificationClick={() => alert("notifications!")}
        onMessageClick={() => alert("messages!")}
        onProfileClick={() => alert("profile!")}
      />

      <div className="container mx-auto p-24">
        <SearchFilterSection />
      </div>

      <div className="container mx-auto py-12 px-24">
        <CardListingSection />
      </div>

      <Footer />
    </div>
  )
}

export default App
