// Convert Firestore timestamp to Date object
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate days until expiry
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get expiry status
export const getExpiryStatus = (expiryDate) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry === null) return 'unknown';
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 3) return 'expiring-soon';
  if (daysUntilExpiry <= 7) return 'expiring-week';
  return 'fresh';
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'expired':
      return '#F44336';
    case 'expiring-soon':
      return '#FF9800';
    case 'expiring-week':
      return '#FFC107';
    case 'fresh':
      return '#4CAF50';
    default:
      return '#757575';
  }
};

// Get status text
export const getStatusText = (status) => {
  switch (status) {
    case 'expired':
      return 'Expired';
    case 'expiring-soon':
      return 'Expiring Soon';
    case 'expiring-week':
      return 'Expiring This Week';
    case 'fresh':
      return 'Fresh';
    default:
      return 'Unknown';
  }
};

// Generate unique filename for image upload
export const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `food_${timestamp}_${randomString}.${extension}`;
}; 