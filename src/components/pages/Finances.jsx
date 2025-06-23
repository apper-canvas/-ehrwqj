import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import StatCard from '@/components/molecules/StatCard';
import TransactionForm from '@/components/organisms/TransactionForm';
import ApperIcon from '@/components/ApperIcon';
import transactionService from '@/services/api/transactionService';
import farmService from '@/services/api/farmService';

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'expenses', 'income'
  const [selectedFarm, setSelectedFarm] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError(err.message || 'Failed to load financial data');
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSubmit = (transactionData) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(transaction => 
        transaction.Id === editingTransaction.Id ? transactionData : transaction
      ));
    } else {
      setTransactions(prev => [...prev, transactionData]);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.delete(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.Id !== transactionId));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (selectedFarm !== 'all') {
      filtered = filtered.filter(t => t.farmId === parseInt(selectedFarm, 10));
    }
    
    if (activeTab === 'expenses') {
      filtered = filtered.filter(t => t.type === 'expense');
    } else if (activeTab === 'income') {
      filtered = filtered.filter(t => t.type === 'income');
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Calculate financial statistics
  const stats = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    netProfit: 0,
    transactionCount: transactions.length
  };
  stats.netProfit = stats.totalIncome - stats.totalExpenses;

  // Chart data for monthly breakdown
  const getMonthlyData = () => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const month = format(new Date(transaction.date), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });

    const months = Object.keys(monthlyData).sort();
    const incomeData = months.map(month => monthlyData[month].income);
    const expenseData = months.map(month => monthlyData[month].expenses);

    return {
      categories: months,
      series: [
        { name: 'Income', data: incomeData },
        { name: 'Expenses', data: expenseData }
      ]
    };
  };

  const chartData = getMonthlyData();
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#7CB342', '#FF6F00'],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: {
      title: { text: 'Amount ($)' },
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString()}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface-300 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-300 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <SkeletonLoader count={4} type="card" />
        </div>
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your farm expenses and income
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Farms</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>
                {farm.name}
              </option>
            ))}
          </select>
          <Button
            onClick={handleCreateTransaction}
            variant="primary"
            icon="Plus"
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Income"
            value={`$${stats.totalIncome.toLocaleString()}`}
            icon="TrendingUp"
            color="success"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Total Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon="TrendingDown"
            color="error"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Net Profit"
            value={`$${stats.netProfit.toLocaleString()}`}
            icon="DollarSign"
            color={stats.netProfit >= 0 ? "success" : "error"}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Transactions"
            value={stats.transactionCount}
            icon="Receipt"
            color="primary"
          />
        </motion.div>
      </div>

      {/* Chart */}
      {chartData.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
              Monthly Income vs Expenses
            </h2>
            <Chart
              options={chartOptions}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'expenses', label: 'Expenses' },
          { key: 'income', label: 'Income' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <TransactionForm
                  transaction={editingTransaction}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No transactions found"
          description="Start by recording your first transaction to track your farm finances."
          actionLabel="Add Your First Transaction"
          onAction={handleCreateTransaction}
        />
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={transaction.type === 'income' ? 'success' : 'error'}>
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFarmName(transaction.farmId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-success' : 'text-error'}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEditTransaction(transaction)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDeleteTransaction(transaction.Id)}
                          className="text-error hover:text-error"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Finances;