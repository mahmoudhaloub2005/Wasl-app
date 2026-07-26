import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AddGeneratorModal from "../../components/Provider/generators/AddGeneratorModal";
import DeleteGeneratorModal from "../../components/Provider/generators/DeleteGeneratorModal";
import EditGeneratorModal from "../../components/Provider/generators/EditGeneratorModal";
import ProviderGeneratorsFeaturedList from "../../components/Provider/generators/ProviderGeneratorsFeaturedList";
import ProviderGeneratorsHeader, {
  ProviderGeneratorsAddButton,
} from "../../components/Provider/generators/ProviderGeneratorsHeader";
import ProviderGeneratorsOverview from "../../components/Provider/generators/ProviderGeneratorsOverview";
import ProviderGeneratorsTable from "../../components/Provider/generators/ProviderGeneratorsTable";
import ProviderGeneratorsToolbar from "../../components/Provider/generators/ProviderGeneratorsToolbar";
import ProviderNavbar from "../../components/Provider/ProviderNavbar/ProviderNavbar";
import Footer from "../../components/layout/Footer/Footer";
import useProviderGenerators from "../../hooks/useProviderGenerators";
import "./ProviderGenerators.css";

function ProviderGenerators() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddGeneratorOpen, setIsAddGeneratorOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState(null);
  const [generatorToDelete, setGeneratorToDelete] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState("");
  const [generatorNotice, setGeneratorNotice] = useState(null);
  const [generatorToast, setGeneratorToast] = useState("");
  const {
    activateGenerator,
    createGenerator,
    deleteGenerator,
    errorMessage,
    featuredGenerators,
    generators,
    isLoading,
    overview,
    pendingActionKey,
    placeGeneratorUnderMaintenance,
    remainingGenerators,
    setSortMode,
    setStatusFilter,
    sortMode,
    statusFilter,
    updateGenerator,
  } = useProviderGenerators();
  const hasGenerators = generators.length > 0;
  const isAddGeneratorRequested = searchParams.get("add") === "1";
  const isAddGeneratorModalOpen =
    isAddGeneratorOpen || isAddGeneratorRequested;
  const isDeletingGenerator = generatorToDelete
    ? pendingActionKey === `delete-${generatorToDelete.id}`
    : false;

  useEffect(() => {
    if (!generatorToast) return undefined;

    const toastTimer = window.setTimeout(() => {
      setGeneratorToast("");
    }, 3000);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [generatorToast]);

  function openAddGeneratorModal() {
    setGeneratorNotice(null);
    setIsAddGeneratorOpen(true);
  }

  function closeAddGeneratorModal() {
    setIsAddGeneratorOpen(false);

    if (searchParams.get("add") === "1") {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete("add");
      setSearchParams(nextSearchParams, { replace: true });
    }
  }

  function handleOpenEditModal(generator) {
    setGeneratorNotice(null);
    setSelectedGenerator(generator);
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setSelectedGenerator(null);
  }

  function goToGeneratorDetails(generatorId) {
    navigate(`/provider/generators/${generatorId}`);
  }

  function handleDeleteGenerator(generator) {
    setGeneratorNotice(null);
    setDeleteModalError("");
    setGeneratorToDelete(generator);
  }

  function handleCloseDeleteModal() {
    if (isDeletingGenerator) return;

    setDeleteModalError("");
    setGeneratorToDelete(null);
  }

  async function handleConfirmDeleteGenerator() {
    if (!generatorToDelete || isDeletingGenerator) return;

    try {
      setDeleteModalError("");
      await deleteGenerator(generatorToDelete.id);
      setGeneratorToDelete(null);
      setGeneratorToast("تم حذف المولد بنجاح.");
    } catch (error) {
      setDeleteModalError(
        error?.message || "تعذر حذف المولد. حاول مرة أخرى."
      );
    }
  }

  function handleGeneratorCreated(result) {
    setGeneratorNotice({
      tone: "success",
      text: result?.message || "تم حفظ المولد بنجاح.",
    });
  }

  async function handleSaveGenerator(updatedGenerator) {
    const result = await updateGenerator(updatedGenerator);
    setGeneratorToast(result?.message || "تم حفظ تعديلات المولد بنجاح.");
  }

  return (
    <div className="provider-generators-page" dir="rtl">
      <ProviderNavbar />

      <main className="provider-generators">
        <section className="provider-generators__top">
          <aside className="provider-generators__side">
            <ProviderGeneratorsAddButton onAddGenerator={openAddGeneratorModal} />
            <ProviderGeneratorsOverview overview={overview} />
          </aside>

          <div className="provider-generators__content">
            <ProviderGeneratorsHeader />

            {errorMessage && (
              <div className="provider-generators-error" role="alert">
                {errorMessage}
              </div>
            )}

            {generatorNotice && (
              <div
                className={`provider-generators-notice provider-generators-notice--${generatorNotice.tone}`}
                role="status"
              >
                {generatorNotice.text}
              </div>
            )}

            <ProviderGeneratorsFeaturedList
              generators={featuredGenerators}
              isLoading={isLoading}
              onActivate={activateGenerator}
              onDelete={handleDeleteGenerator}
              onEdit={handleOpenEditModal}
              onMaintenance={placeGeneratorUnderMaintenance}
              pendingActionKey={pendingActionKey}
            />
          </div>
        </section>

        {hasGenerators && (
          <section className="provider-generators__remaining">
            <div className="provider-generators__remaining-header">
              <ProviderGeneratorsToolbar
                setSortMode={setSortMode}
                setStatusFilter={setStatusFilter}
                sortMode={sortMode}
                statusFilter={statusFilter}
              />
              <h2>بقية المولدات</h2>
            </div>

            <ProviderGeneratorsTable
              generators={remainingGenerators}
              isLoading={isLoading}
              onActivate={activateGenerator}
              onDelete={handleDeleteGenerator}
              onEdit={handleOpenEditModal}
              onMaintenance={placeGeneratorUnderMaintenance}
              onOpenDetails={goToGeneratorDetails}
              pendingActionKey={pendingActionKey}
            />
          </section>
        )}
      </main>

      <AddGeneratorModal
        isOpen={isAddGeneratorModalOpen}
        onClose={closeAddGeneratorModal}
        onCreated={handleGeneratorCreated}
        onSubmit={createGenerator}
      />

      {isEditModalOpen && selectedGenerator ? (
        <EditGeneratorModal
          generator={selectedGenerator}
          isOpen={isEditModalOpen}
          key={`${selectedGenerator.id}-${selectedGenerator.updatedAt || ""}`}
          onClose={handleCloseEditModal}
          onSave={handleSaveGenerator}
        />
      ) : null}

      <DeleteGeneratorModal
        errorMessage={deleteModalError}
        generator={generatorToDelete}
        isDeleting={isDeletingGenerator}
        isOpen={Boolean(generatorToDelete)}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteGenerator}
      />

      {generatorToast ? (
        <div className="provider-generators-toast" role="status">
          {generatorToast}
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

export default ProviderGenerators;


