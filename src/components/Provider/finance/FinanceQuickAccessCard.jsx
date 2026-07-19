import { useRef, useState } from "react";
import { FiBarChart2, FiDownload, FiFileText, FiShield } from "react-icons/fi";

import {
  downloadInvoiceReportPdf,
  hasInvoiceReportData,
  invoiceReportMessages,
} from "../../../utils/generateInvoiceReport";

const iconMap = {
  chart: FiBarChart2,
  receipt: FiFileText,
  shield: FiShield,
};

function FinanceQuickAccessCard({
  invoices = [],
  item,
  onNavigate,
  providerName = "",
}) {
  const Icon = iconMap[item.iconKey] || FiFileText;
  const isReportsCard = item.id === "reports";
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);
  const reportGenerationLockRef = useRef(false);

  function navigateToItem() {
    if (isReportsCard) return;

    onNavigate(item.path);
  }

  async function handleReportDownload() {
    if (isGeneratingReport || reportGenerationLockRef.current) return;

    if (!hasInvoiceReportData(invoices)) {
      setReportMessage({
        text: invoiceReportMessages.empty,
        tone: "warning",
      });
      return;
    }

    reportGenerationLockRef.current = true;
    setIsGeneratingReport(true);
    setReportMessage(null);

    try {
      await downloadInvoiceReportPdf({ invoices, providerName });
    } catch (error) {
      const isEmptyError = error?.message === invoiceReportMessages.empty;

      setReportMessage({
        text: isEmptyError ? invoiceReportMessages.empty : invoiceReportMessages.error,
        tone: isEmptyError ? "warning" : "error",
      });
    } finally {
      reportGenerationLockRef.current = false;
      setIsGeneratingReport(false);
    }
  }

  function handleActionClick(event) {
    event.stopPropagation();

    if (isReportsCard) {
      handleReportDownload();
      return;
    }

    navigateToItem();
  }

  const interactiveCardProps = isReportsCard
    ? {}
    : {
        onClick: navigateToItem,
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigateToItem();
          }
        },
        role: "button",
        tabIndex: 0,
      };

  return (
    <article
      aria-label={item.title}
      className={`finance-quick-card${isReportsCard ? " finance-quick-card--reports" : ""}`}
      {...interactiveCardProps}
    >
      <span className="finance-quick-card__icon" aria-hidden="true">
        <Icon />
      </span>

      <h3>{item.title}</h3>
      <p>{item.description}</p>

      <button
        type="button"
        aria-label={
          isReportsCard
            ? "تنزيل تقرير الفواتير المالية للشهر الحالي"
            : item.buttonLabel
        }
        className={`finance-quick-card__button finance-quick-card__button--${item.tone}`}
        disabled={isReportsCard && isGeneratingReport}
        onClick={handleActionClick}
      >
        {isReportsCard ? <FiDownload aria-hidden="true" /> : null}
        <span>
          {isReportsCard && isGeneratingReport
            ? invoiceReportMessages.loading
            : item.buttonLabel}
        </span>
      </button>

      {isReportsCard && reportMessage ? (
        <p
          className={`finance-quick-card__message finance-quick-card__message--${reportMessage.tone}`}
          role={reportMessage.tone === "error" ? "alert" : "status"}
        >
          {reportMessage.text}
        </p>
      ) : null}
    </article>
  );
}

export default FinanceQuickAccessCard;