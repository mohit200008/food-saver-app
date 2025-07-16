export const foodCategories = [
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
  { id: 'meat', name: 'Meat & Fish', icon: '🥩' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'grains', name: 'Grains & Bread', icon: '🍞' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'frozen', name: 'Frozen Foods', icon: '🧊' },
  { id: 'canned', name: 'Canned Goods', icon: '🥫' },
  { id: 'condiments', name: 'Condiments', icon: '🧂' },
  { id: 'other', name: 'Other', icon: '📦' }
];

export const getCategoryIcon = (categoryId) => {
  const category = foodCategories.find(cat => cat.id === categoryId);
  return category ? category.icon : '📦';
};

export const getCategoryName = (categoryId) => {
  const category = foodCategories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Other';
}; 