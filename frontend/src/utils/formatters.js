// Formats numbers to Indian Rupees currency (e.g. ₹ 4,65,000 or ₹ 4.65 Lakh)
export const formatINR = (amount, withLakh = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);

  if (withLakh && num >= 100000) {
    const lakhs = (num / 100000).toFixed(2);
    return `₹${lakhs} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

// Format exact Indian comma format
export const formatIndianNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Indian date formatter
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
