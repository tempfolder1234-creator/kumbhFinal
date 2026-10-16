import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });

  // Handle browser back/forward and initial URL state
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (id) {
        setSelectedListingId(id);
        setCurrentView("detail");
      } else if (path.includes("/profile")) {
        setCurrentView("profile");
      } else if (path.includes("/new")) {
        setCurrentView("create");
      } else {
        setCurrentView("home");
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (view, payload = null) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (view === "home") {
      setSelectedListingId(null);
      setEditingListing(null);
      window.history.pushState({}, "", "/");
    } else if (view === "detail" && payload) {
      setSelectedListingId(payload);
      window.history.pushState({}, "", `/?id=${payload}`);
    } else if (view === "edit" && payload) {
      setEditingListing(payload);
    } else if (view === "create") {
      window.history.pushState({}, "", "/new");
    } else if (view === "profile") {
      window.history.pushState({}, "", "/profile");
    } else if (view === "login" || view === "signup") {
      setAuthModal({ open: true, mode: view });
    }
  };

  return (
    <div className="sh-app">
      <Navbar
        onNavigate={navigateTo}
        currentView={currentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => {
          if (currentView !== "home") navigateTo("home");
        }}
      />

      {currentView === "home" && (
        <HomePage
          onSelectListing={(id) => navigateTo("detail", id)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {currentView === "detail" && (
        <ListingDetailPage
          listingId={selectedListingId}
          onBack={() => navigateTo("home")}
          onEdit={(listing) => navigateTo("edit", listing)}
          onDeleted={() => navigateTo("home")}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        />
      )}

      {currentView === "create" && (
        <CreateListingPage
          onBack={() => navigateTo("home")}
          onSuccess={(newListing) => navigateTo("detail", newListing._id)}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        />
      )}

      {currentView === "edit" && editingListing && (
        <EditListingPage
          listing={editingListing}
          onBack={() => navigateTo("detail", editingListing._id)}
          onSuccess={(updated) => navigateTo("detail", updated._id)}
        />
      )}

      {currentView === "profile" && (
        <ProfilePage
          onBack={() => navigateTo("home")}
          onSelectListing={(id) => navigateTo("detail", id)}
          onEditListing={(listing) => navigateTo("edit", listing)}
          onCreateListing={() => navigateTo("create")}
        />
      )}

      <Footer />

      {/* Authentication Modal */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: "login" })}
          onSuccess={() => {}}
        />
      )}

      <style>{`
        .sh-app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
