const defaultValues = {
  sellingPrice: 29.99,
  purchaseCost: 45,
  domesticShipping: 5,
  internationalShipping: 18,
  commissionRate: 15,
  fbaFee: 4.5,
  adCost: 3,
  exchangeRate: 7.2,
};

const fields = Object.keys(defaultValues).reduce((items, id) => {
  items[id] = document.getElementById(id);
  return items;
}, {});

const results = {
  totalCost: document.getElementById('totalCost'),
  profit: document.getElementById('profit'),
  profitMargin: document.getElementById('profitMargin'),
  roi: document.getElementById('roi'),
};

function getNumber(id) {
  return Number(fields[id].value) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function calculateProfit() {
  const sellingPriceRmb = getNumber('sellingPrice') * getNumber('exchangeRate');
  const commissionFee = sellingPriceRmb * (getNumber('commissionRate') / 100);
  const fbaFeeRmb = getNumber('fbaFee') * getNumber('exchangeRate');
  const adCostRmb = getNumber('adCost') * getNumber('exchangeRate');

  const totalCost =
    getNumber('purchaseCost') +
    getNumber('domesticShipping') +
    getNumber('internationalShipping') +
    commissionFee +
    fbaFeeRmb +
    adCostRmb;

  const profit = sellingPriceRmb - totalCost;
  const profitMargin = sellingPriceRmb > 0 ? (profit / sellingPriceRmb) * 100 : 0;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  results.totalCost.textContent = formatCurrency(totalCost);
  results.profit.textContent = formatCurrency(profit);
  results.profitMargin.textContent = formatPercent(profitMargin);
  results.roi.textContent = formatPercent(roi);
}

function restoreDefaults() {
  Object.entries(defaultValues).forEach(([id, value]) => {
    fields[id].value = value;
  });
  calculateProfit();
}

Object.values(fields).forEach((field) => {
  field.addEventListener('input', calculateProfit);
});

document.getElementById('profitForm').addEventListener('reset', (event) => {
  event.preventDefault();
  restoreDefaults();
});

calculateProfit();
