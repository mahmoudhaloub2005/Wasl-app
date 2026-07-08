import "./FinancialLayout.css";

function FinancialRow({
  customer,
  amount,
  dueDate,
  status,
  statusClass,
}) {
  return (
    <tr>

      <td>{customer}</td>

      <td>{amount} شيكل</td>

      <td>{dueDate}</td>

      <td>
        <span className={`status ${statusClass}`}>
          {status}
        </span>
      </td>

    </tr>
  );
}

export default FinancialRow;

