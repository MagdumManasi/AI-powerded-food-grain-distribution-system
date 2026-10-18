// Computed Dashboard Statistics from Centralized Mock Dataset (Sangli District)

export const computeDashboardStats = (mockStore) => {
  const {
    warehouses = [],
    fpsShops = [],
    beneficiaries = [],
    inventory = [],
    dispatches = [],
    distributions = [],
    alerts = [],
  } = mockStore;

  // Calculate total stock by grain type
  let totalRiceStockKg = 0;
  let totalWheatStockKg = 0;

  inventory.forEach((inv) => {
    if (inv.grainTypeId === 1) {
      totalRiceStockKg += inv.availableStockKg || 0;
    } else if (inv.grainTypeId === 2) {
      totalWheatStockKg += inv.availableStockKg || 0;
    }
  });

  // Calculate distributions by shop for Recharts BarChart
  const shopDistributionMap = {};
  fpsShops.forEach((shop) => {
    shopDistributionMap[shop.shopCode] = {
      shopCode: shop.shopCode,
      shopName: shop.shopName,
      village: shop.village,
      district: shop.district,
      totalDistributedKg: 0,
    };
  });

  distributions.forEach((tx) => {
    if (shopDistributionMap[tx.shopCode]) {
      shopDistributionMap[tx.shopCode].totalDistributedKg += tx.quantityKg || 0;
    }
  });

  const shopDistributionStats = Object.values(shopDistributionMap);

  // Count alerts
  const openAlerts = alerts.filter((a) => a.status === 'OPEN' || a.status === 'UNDER_REVIEW').length;
  const highPriorityAlerts = alerts.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
  const stockDiscrepancies = dispatches.filter((d) => (d.shortageQuantity || 0) > 0).length;

  return {
    totalGodowns: warehouses.length,
    totalRationShops: fpsShops.length,
    totalBeneficiaries: beneficiaries.length,
    totalRiceStockKg: Math.round(totalRiceStockKg),
    totalWheatStockKg: Math.round(totalWheatStockKg),
    totalStockKg: Math.round(totalRiceStockKg + totalWheatStockKg),
    openAlerts,
    highPriorityAlerts,
    stockDiscrepancies,
    distributionTransactionsCount: distributions.length,
    pendingReviews: alerts.filter((a) => a.status === 'UNDER_REVIEW').length,
    activeShipmentsCount: dispatches.filter((d) => d.status === 'IN_TRANSIT' || d.status === 'RECEIPT_PENDING').length,
    deliveredShipmentsCount: dispatches.filter((d) => d.status === 'DELIVERED' || d.status === 'PARTIALLY_RECEIVED').length,
    shopDistributionStats,
    demoLocality: 'Sangli District (Miraj Taluka - Bedag & Belanki)',
  };
};
