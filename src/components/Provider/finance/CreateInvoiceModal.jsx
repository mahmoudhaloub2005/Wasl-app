import { useCallback, useEffect, useRef } from "react";
import { FiFileText, FiSearch, FiUser, FiUsers, FiX } from "react-icons/fi";

import useCreateProviderInvoice from "../../../hooks/useCreateProviderInvoice";
import "./CreateInvoiceModal.css";

function SearchResults({ invoiceForm }) {
  const query = invoiceForm.subscriberQuery.trim();

  if (!invoiceForm.canSearchSubscribers) return null;

  if (query.length > 0 && query.length < invoiceForm.minSearchLength) {
    return (
      <p className="provider-create-invoice-modal__hint">
        اكتب حرفين على الأقل لبدء البحث.
      </p>
    );
  }

  if (invoiceForm.subscriberSearchLoading) {
    return (
      <p className="provider-create-invoice-modal__hint" role="status">
        جاري البحث عن المشتركين...
      </p>
    );
  }

  if (invoiceForm.searchError) {
    return (
      <p className="provider-create-invoice-modal__field-error" role="alert">
        {invoiceForm.searchError}
      </p>
    );
  }

  if (query.length >= invoiceForm.minSearchLength && !invoiceForm.subscriberResults.length) {
    return (
      <p className="provider-create-invoice-modal__hint">
        لا يوجد مشترك مطابق لعملية البحث
      </p>
    );
  }

  if (!invoiceForm.subscriberResults.length) return null;

  return (
    <div className="provider-create-invoice-modal__results" role="listbox">
      {invoiceForm.subscriberResults.map((subscriber) => (
        <button
          type="button"
          key={subscriber.id || subscriber.subscriptionId || subscriber.name}
          onClick={() => invoiceForm.selectSubscriber(subscriber)}
          role="option"
        >
          <span aria-hidden="true">
            <FiUser />
          </span>
          <strong>{subscriber.name || "اسم المشترك غير متوفر"}</strong>
          <small>
            {subscriber.subscriptionNumber || subscriber.subscriptionId || "رقم الاشتراك غير متوفر"}
            {subscriber.phone ? ` · ${subscriber.phone}` : ""}
          </small>
        </button>
      ))}
    </div>
  );
}

function CreateInvoiceModal({ isOpen, onClose, onCreated }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const invoiceForm = useCreateProviderInvoice({ isOpen, onClose, onCreated });
  const readingUnit = invoiceForm.subscription?.readingUnit || "أمبير";

  const handleClose = useCallback(() => {
    if (invoiceForm.isSubmitting) return;

    invoiceForm.resetForm();
    onClose?.();
  }, [invoiceForm, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    function handleKeyDown(event) {
      if (event.key === "Escape" && !invoiceForm.isSubmitting) {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [handleClose, invoiceForm.isSubmitting, isOpen]);

  if (!isOpen) return null;


  function handleSubmit(event) {
    event.preventDefault();
    invoiceForm.createInvoice();
  }

  return (
    <div
      className="provider-create-invoice-modal__backdrop"
      onMouseDown={handleClose}
      role="presentation"
    >
      <section
        aria-labelledby="create-invoice-title"
        aria-modal="true"
        className="provider-create-invoice-modal"
        dir="rtl"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button
          type="button"
          className="provider-create-invoice-modal__close"
          aria-label="إغلاق نافذة إصدار الفاتورة"
          disabled={invoiceForm.isSubmitting}
          onClick={handleClose}
        >
          <FiX aria-hidden="true" />
        </button>

        <h2 id="create-invoice-title">إصدار فاتورة جديدة</h2>

        {invoiceForm.statusMessage && (
          <div className="provider-create-invoice-modal__notice" role="status">
            {invoiceForm.statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <section className="provider-create-invoice-modal__panel">
            <div className="provider-create-invoice-modal__section-title">
              <FiUsers aria-hidden="true" />
              <div>
                <h3>البحث عن مشترك</h3>
                <p>اسم المشترك أو رقم الهوية</p>
              </div>
            </div>

            <label className="provider-create-invoice-modal__search">
              <input
                type="search"
                value={invoiceForm.subscriberQuery}
                onChange={(event) => invoiceForm.setSubscriberQuery(event.target.value)}
                placeholder="ابحث بالاسم، رقم المشترك، أو رقم الهاتف..."
                disabled={!invoiceForm.canSearchSubscribers || invoiceForm.isSubmitting}
              />
              <FiSearch aria-hidden="true" />
            </label>

            <SearchResults invoiceForm={invoiceForm} />
          </section>

          <section className="provider-create-invoice-modal__panel">
            <div className="provider-create-invoice-modal__section-title provider-create-invoice-modal__section-title--muted">
              <FiFileText aria-hidden="true" />
              <h3>بيانات الفاتورة</h3>
            </div>

            <div className="provider-create-invoice-modal__grid">
              <label className="provider-create-invoice-modal__field">
                <span>رقم الاشتراك</span>
                <input
                  type="text"
                  value={invoiceForm.subscriptionNumber || "---"}
                  disabled
                  readOnly
                />
                {invoiceForm.fieldErrors.subscription && (
                  <small>{invoiceForm.fieldErrors.subscription}</small>
                )}
              </label>

              <label className="provider-create-invoice-modal__field">
                <span>تاريخ الاستحقاق (due_date)</span>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(event) => invoiceForm.setDueDate(event.target.value)}
                  disabled={!invoiceForm.selectedSubscriber || invoiceForm.isSubmitting}
                  required
                />
                {invoiceForm.fieldErrors.due_date && (
                  <small>{invoiceForm.fieldErrors.due_date}</small>
                )}
              </label>

              <label className="provider-create-invoice-modal__field">
                <span>القراءة السابقة (previous_reading)</span>
                <div className="provider-create-invoice-modal__unit-input">
                  <input
                    type="text"
                    value={invoiceForm.previousReading === "" ? "---" : invoiceForm.previousReading}
                    disabled
                    readOnly
                  />
                  <b>{readingUnit}</b>
                </div>
              </label>

              <label className="provider-create-invoice-modal__field">
                <span>القراءة الحالية (current_reading)</span>
                <div className="provider-create-invoice-modal__unit-input">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoiceForm.currentReading}
                    onChange={(event) => invoiceForm.setCurrentReading(event.target.value)}
                    placeholder="أدخل القراءة الحالية"
                    disabled={!invoiceForm.selectedSubscriber || invoiceForm.isSubmitting}
                    required
                  />
                  <b>{readingUnit}</b>
                </div>
                {invoiceForm.fieldErrors.current_reading && (
                  <small>{invoiceForm.fieldErrors.current_reading}</small>
                )}
              </label>
            </div>
          </section>

          {invoiceForm.submitError && (
            <p className="provider-create-invoice-modal__submit-error" role="alert">
              {invoiceForm.submitError}
            </p>
          )}

          <button
            type="submit"
            className="provider-create-invoice-modal__submit"
            disabled={invoiceForm.isSubmitDisabled}
          >
            {invoiceForm.isSubmitting ? "جاري إصدار الفاتورة..." : "إصدار فاتورة"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateInvoiceModal;
