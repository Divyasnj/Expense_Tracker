import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

type Transaction = {
  amount: number;
  type: 'income' | 'expense';
  categoryId: {
    name: string;
  };
};

export default function TransactionChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const COLORS = ['#00C49F', '#FF8042']; // income, expense

  // Pie Chart Data (total income vs expense)
  const totalData = [
    {
      name: 'Income',
      value: transactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0),
    },
    {
      name: 'Expense',
      value: transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0),
    },
  ];

  // Bar Chart Data (by category)
  const categoryTotals: { [key: string]: number } = {};
  transactions.forEach((tx) => {
    const name = tx.categoryId?.name || 'Unknown';
    categoryTotals[name] = (categoryTotals[name] || 0) + tx.amount;
  });

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="overflow-x-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            Income vs Expense
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={totalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {totalData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1cf619" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
