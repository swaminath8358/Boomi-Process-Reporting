/**
 * Mock data generator for Boomi integration processes
 * Simulates realistic process execution data with various statuses and environments
 */

const { faker } = require('@faker-js/faker');

// Configuration for mock data generation
const ENVIRONMENTS = ['Dev', 'Test', 'Prod'];
const STATUSES = ['Success', 'Failed', 'In Progress', 'Warning'];
const TRADING_PARTNERS = [
  'Amazon', 'Walmart', 'Target', 'Best Buy', 'Home Depot',
  'Costco', 'Kroger', 'CVS', 'Walgreens', 'FedEx'
];

const PROCESS_NAMES = [
  'Customer Order Processing',
  'Inventory Sync',
  'Payment Processing',
  'Shipping Label Generation',
  'Product Catalog Update',
  'Invoice Generation',
  'Return Processing',
  'Price Update Sync',
  'Customer Data Sync',
  'Financial Reporting'
];

/**
 * Generate a single mock process execution
 */
const generateMockProcess = (id, customData = {}) => {
  const startTime = faker.date.recent({ days: 30 });
  const endTime = new Date(startTime.getTime() + faker.number.int({ min: 1000, max: 300000 }));
  const status = customData.status || faker.helpers.arrayElement(STATUSES);
  
  const process = {
    id: id || faker.string.uuid(),
    processId: `PROC_${faker.string.alphanumeric(8).toUpperCase()}`,
    processName: faker.helpers.arrayElement(PROCESS_NAMES),
    startTime: startTime.toISOString(),
    endTime: status === 'In Progress' ? null : endTime.toISOString(),
    status,
    environment: faker.helpers.arrayElement(ENVIRONMENTS),
    tradingPartner: faker.helpers.arrayElement(TRADING_PARTNERS),
    executionTime: status === 'In Progress' ? null : endTime - startTime,
    recordsProcessed: faker.number.int({ min: 10, max: 50000 }),
    errorDetails: status === 'Failed' ? generateErrorDetails() : null,
    warnings: status === 'Warning' ? generateWarnings() : null,
    createdAt: startTime.toISOString(),
    updatedAt: (status === 'In Progress' ? new Date() : endTime).toISOString(),
    ...customData
  };

  return process;
};

/**
 * Generate realistic error details for failed processes
 */
const generateErrorDetails = () => {
  const errorTypes = [
    'Connection timeout',
    'Authentication failed',
    'Data validation error',
    'File not found',
    'Permission denied',
    'SQL constraint violation',
    'Memory allocation error',
    'Network unreachable'
  ];

  const errorType = faker.helpers.arrayElement(errorTypes);
  
  return {
    errorCode: `ERR_${faker.string.alphanumeric(6).toUpperCase()}`,
    errorType,
    message: `${errorType}: ${faker.lorem.sentence()}`,
    stackTrace: generateStackTrace(),
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    retryable: faker.datatype.boolean(),
    retryCount: faker.number.int({ min: 0, max: 3 })
  };
};

/**
 * Generate warning details
 */
const generateWarnings = () => {
  return [
    {
      warningCode: `WARN_${faker.string.alphanumeric(6).toUpperCase()}`,
      message: faker.lorem.sentence(),
      timestamp: faker.date.recent().toISOString()
    }
  ];
};

/**
 * Generate realistic stack trace
 */
const generateStackTrace = () => {
  const stackLines = [
    `    at ProcessExecutor.execute(ProcessExecutor.java:${faker.number.int({ min: 100, max: 999 })})`,
    `    at ConnectorManager.processData(ConnectorManager.java:${faker.number.int({ min: 50, max: 500 })})`,
    `    at DataProcessor.transform(DataProcessor.java:${faker.number.int({ min: 20, max: 200 })})`,
    `    at ExecutionEngine.run(ExecutionEngine.java:${faker.number.int({ min: 10, max: 100 })})`
  ];
  
  return stackLines.join('\n');
};

/**
 * Generate a collection of mock processes
 */
const generateMockProcesses = (count = 100) => {
  const processes = [];
  
  for (let i = 0; i < count; i++) {
    processes.push(generateMockProcess(i + 1));
  }
  
  // Ensure we have some recent "In Progress" processes for real-time demo
  for (let i = 0; i < 3; i++) {
    processes.push(generateMockProcess(count + i + 1, {
      status: 'In Progress',
      startTime: new Date(Date.now() - faker.number.int({ min: 10000, max: 600000 })).toISOString()
    }));
  }
  
  return processes.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
};

/**
 * Generate dashboard summary statistics
 */
const generateDashboardSummary = (processes) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const todayProcesses = processes.filter(p => new Date(p.startTime) >= today);
  const last7DaysProcesses = processes.filter(p => new Date(p.startTime) >= last7Days);
  const last30DaysProcesses = processes.filter(p => new Date(p.startTime) >= last30Days);

  return {
    totalProcesses: processes.length,
    todayStats: {
      total: todayProcesses.length,
      success: todayProcesses.filter(p => p.status === 'Success').length,
      failed: todayProcesses.filter(p => p.status === 'Failed').length,
      inProgress: todayProcesses.filter(p => p.status === 'In Progress').length,
      warning: todayProcesses.filter(p => p.status === 'Warning').length
    },
    weeklyStats: {
      total: last7DaysProcesses.length,
      success: last7DaysProcesses.filter(p => p.status === 'Success').length,
      failed: last7DaysProcesses.filter(p => p.status === 'Failed').length,
      avgExecutionTime: calculateAverageExecutionTime(last7DaysProcesses)
    },
    monthlyStats: {
      total: last30DaysProcesses.length,
      success: last30DaysProcesses.filter(p => p.status === 'Success').length,
      failed: last30DaysProcesses.filter(p => p.status === 'Failed').length,
      avgExecutionTime: calculateAverageExecutionTime(last30DaysProcesses)
    },
    environmentBreakdown: generateEnvironmentBreakdown(processes),
    dailyTrends: generateDailyTrends(processes, 7)
  };
};

/**
 * Calculate average execution time for completed processes
 */
const calculateAverageExecutionTime = (processes) => {
  const completedProcesses = processes.filter(p => p.executionTime);
  if (completedProcesses.length === 0) return 0;
  
  const totalTime = completedProcesses.reduce((sum, p) => sum + p.executionTime, 0);
  return Math.round(totalTime / completedProcesses.length);
};

/**
 * Generate environment-wise process breakdown
 */
const generateEnvironmentBreakdown = (processes) => {
  const breakdown = {};
  
  ENVIRONMENTS.forEach(env => {
    const envProcesses = processes.filter(p => p.environment === env);
    breakdown[env] = {
      total: envProcesses.length,
      success: envProcesses.filter(p => p.status === 'Success').length,
      failed: envProcesses.filter(p => p.status === 'Failed').length,
      inProgress: envProcesses.filter(p => p.status === 'In Progress').length
    };
  });
  
  return breakdown;
};

/**
 * Generate daily execution trends
 */
const generateDailyTrends = (processes, days = 7) => {
  const trends = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayProcesses = processes.filter(p => {
      const processDate = new Date(p.startTime);
      return processDate >= dayStart && processDate < dayEnd;
    });
    
    trends.push({
      date: dayStart.toISOString().split('T')[0],
      total: dayProcesses.length,
      success: dayProcesses.filter(p => p.status === 'Success').length,
      failed: dayProcesses.filter(p => p.status === 'Failed').length,
      avgExecutionTime: calculateAverageExecutionTime(dayProcesses)
    });
  }
  
  return trends;
};

module.exports = {
  generateMockProcess,
  generateMockProcesses,
  generateDashboardSummary,
  ENVIRONMENTS,
  STATUSES,
  TRADING_PARTNERS,
  PROCESS_NAMES
};
