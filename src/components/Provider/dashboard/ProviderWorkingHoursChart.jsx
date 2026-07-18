import ProviderChartTabs from "./ProviderChartTabs";
import ProviderEmptyState from "./ProviderEmptyState";
import ProviderErrorState from "./ProviderErrorState";

function clampPercentage(value) {
  const percentage = Number(value);

  if (Number.isNaN(percentage)) return 0;

  return Math.min(100, Math.max(0, percentage));
}

function ProviderWorkingHoursChart({
  periods,
  activePeriod,
  data,
  errorMessage,
  isLoading,
  onPeriodChange,
}) {
  return (
    <article className="provider-dashboard-panel provider-working-chart">
      <div className="provider-working-chart__header">
        <ProviderChartTabs
          periods={periods}
          activePeriod={activePeriod}
          onChange={onPeriodChange}
        />

        <div className="provider-working-chart__title">
          <h2>ساعات عمل المولدات</h2>
          <p>{data?.description || "تحليل الأداء للفترة المحددة"}</p>
        </div>
      </div>

      {errorMessage ? (
        <ProviderErrorState message={errorMessage} />
      ) : isLoading ? (
        <div className="provider-working-chart__bars" aria-label="جاري تحميل الرسم">
          {Array.from({ length: activePeriod === "monthly" ? 4 : 7 }).map(
            (_, index) => (
              <div
                className="provider-working-chart__item provider-working-chart__item--loading"
                key={index}
              >
                <div className="provider-working-chart__bar provider-working-chart__bar--loading" />
                <strong />
              </div>
            )
          )}
        </div>
      ) : data?.points?.length ? (
        <div className="provider-working-chart__bars" aria-label="ساعات عمل المولدات">
          {(data?.points || []).map((item) => {
            const value = clampPercentage(item.value);

            return (
              <div className="provider-working-chart__item" key={item.id}>
                <div className="provider-working-chart__bar">
                  <span style={{ height: `${value}%` }} />
                </div>
                <strong>{item.label}</strong>
              </div>
            );
          })}
        </div>
      ) : (
        <ProviderEmptyState message="لا توجد بيانات تشغيل مسجلة لهذه الفترة" />
      )}
    </article>
  );
}

export default ProviderWorkingHoursChart;
