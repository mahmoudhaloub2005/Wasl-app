import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import AddAdvertisementModal from "../../components/Provider/advertisements/AddAdvertisementModal";
import AdvertisementAnalyticsModal from "../../components/Provider/advertisements/AdvertisementAnalyticsModal";
import AdvertisementDeleteModal from "../../components/Provider/advertisements/AdvertisementDeleteModal";
import AdvertisementForm from "../../components/Provider/advertisements/AdvertisementForm";
import AdvertisementOverview from "../../components/Provider/advertisements/AdvertisementOverview";
import AdvertisementsHistory from "../../components/Provider/advertisements/AdvertisementsHistory";
import MarketAnalytics from "../../components/Provider/advertisements/MarketAnalytics";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import useProviderAdvertisements from "../../hooks/useProviderAdvertisements";
import { providerServicePendingMessage } from "../../services/provider/providerFrontendStatus";
import "./ProviderAdvertisements.css";

function ProviderAdvertisements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    advertisements,
    createAdvertisement,
    deleteAdvertisement,
    errorMessage,
    marketAnalytics,
    overview,
    pendingActionKey,
    toggleAdvertisementStatus,
    updateAdvertisement,
  } = useProviderAdvertisements();
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [analyticsTarget, setAnalyticsTarget] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isCreateAdvertisementRequested = searchParams.get("add") === "1";
  const isAddAdvertisementModalOpen =
    isCreateModalOpen || isCreateAdvertisementRequested;
  const isSubmitting =
    pendingActionKey === "create" ||
    pendingActionKey === `edit-${editingAdvertisement?.id}`;
  const isDeleting =
    deleteTarget && pendingActionKey === `delete-${deleteTarget.id}`;

  function openCreateModal() {
    setSuccessMessage("");
    setEditingAdvertisement(null);
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);

    if (searchParams.get("add") === "1") {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("add");
      setSearchParams(nextSearchParams, { replace: true });
    }
  }

  async function handleCreateAdvertisement(formData) {
    setSuccessMessage("");
    const createdAdvertisement = await createAdvertisement(formData);

    setSuccessMessage(providerServicePendingMessage);
    return createdAdvertisement;
  }

  async function handleFormSubmit(advertisementData) {
    setSuccessMessage("");

    if (editingAdvertisement) {
      await updateAdvertisement(editingAdvertisement.id, advertisementData);
      setEditingAdvertisement(null);
      setSuccessMessage(providerServicePendingMessage);
      return;
    }

    await createAdvertisement(advertisementData);
    setSuccessMessage(providerServicePendingMessage);
  }

  function handleEditAdvertisement(advertisement) {
    setSuccessMessage("");
    setEditingAdvertisement(advertisement);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleToggleStatus(advertisementId) {
    setSuccessMessage("");

    try {
      await toggleAdvertisementStatus(advertisementId);
      setSuccessMessage(providerServicePendingMessage);
    } catch {
      // The hook exposes the Arabic error message in the page alert.
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    setSuccessMessage("");

    try {
      await deleteAdvertisement(deleteTarget.id);

      if (editingAdvertisement?.id === deleteTarget.id) {
        setEditingAdvertisement(null);
      }

      setDeleteTarget(null);
      setSuccessMessage(providerServicePendingMessage);
    } catch {
      // The hook exposes the Arabic error message in the page alert.
    }
  }

  return (
    <div className="provider-advertisements-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-advertisements">
        <header
          className="provider-advertisements__header"
          aria-labelledby="provider-advertisements-title"
        >
          <div>
            <h1 id="provider-advertisements-title">مركز الإعلانات</h1>
            <p>قم بإدارة حملاتك الإعلانية ومراقبة أداء السوق.</p>
          </div>
          <button
            type="button"
            className="provider-advertisements__add-button"
            onClick={openCreateModal}
          >
            إضافة إعلان جديد
          </button>
        </header>

        {(errorMessage || successMessage) && (
          <div
            className={`provider-advertisements__message ${
              errorMessage ? "provider-advertisements__message--error" : ""
            }`}
            role="alert"
          >
            {errorMessage || successMessage}
          </div>
        )}

        <section className="provider-advertisements__main">
          <aside className="provider-advertisements__side">
            <AdvertisementOverview overview={overview} />
            <AdvertisementsHistory
              advertisements={advertisements}
              onDelete={setDeleteTarget}
              onEdit={handleEditAdvertisement}
              onOpenAnalytics={setAnalyticsTarget}
              onToggleStatus={handleToggleStatus}
              pendingActionKey={pendingActionKey}
            />
          </aside>

          {editingAdvertisement ? (
            <section className="provider-advertisements__form-column">
              <AdvertisementForm
                advertisement={editingAdvertisement}
                isSubmitting={isSubmitting}
                key={editingAdvertisement.id}
                onCancelEdit={() => setEditingAdvertisement(null)}
                onSubmit={handleFormSubmit}
              />
            </section>
          ) : (
            <section className="provider-advertisements__create-card">
              <h2>إضافة إعلان جديد</h2>
              <p>أنشئ عرضاً جديداً وارفع صورة الإعلان من النافذة المخصصة.</p>
              <button type="button" onClick={openCreateModal}>
                إضافة إعلان جديد
              </button>
            </section>
          )}
        </section>

        <MarketAnalytics analytics={marketAnalytics} />
      </main>

      <Footer />

      <AdvertisementDeleteModal
        advertisement={deleteTarget}
        isDeleting={Boolean(isDeleting)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <AdvertisementAnalyticsModal
        advertisement={analyticsTarget}
        onClose={() => setAnalyticsTarget(null)}
      />

      <AddAdvertisementModal
        isOpen={isAddAdvertisementModalOpen}
        isSubmitting={pendingActionKey === "create"}
        onClose={closeCreateModal}
        onSubmit={handleCreateAdvertisement}
      />
    </div>
  );
}

export default ProviderAdvertisements;
