const express = require('express');
const Joi = require('joi');
const { requireRole } = require('../middleware/auth');
const { 
  generateMockProcesses, 
  generateDashboardSummary,
  generateMockProcess,
  ENVIRONMENTS,
  STATUSES,
  TRADING_PARTNERS
} = require('../models/mockData');

const router = express.Router();

// In-memory storage for demo (in production, use a real database)
let mockProcesses = generateMockProcesses(500);

// Validation schemas
const filterSchema = Joi.object({
  environment: Joi.string().valid(...ENVIRONMENTS),
  status: Joi.string().valid(...STATUSES),
  tradingPartner: Joi.string(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().valid('startTime', 'processName', 'status', 'environment').default('startTime'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().max(100)
});

/**
 * GET /api/processes
 * Fetch processes with filtering, pagination, and sorting
 */
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = filterSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const { 
      environment, 
      status, 
      tradingPartner, 
      startDate, 
      endDate, 
      page, 
      limit, 
      sortBy, 
      sortOrder,
      search 
    } = value;

    // Apply filters
    let filteredProcesses = mockProcesses.filter(process => {
      if (environment && process.environment !== environment) return false;
      if (status && process.status !== status) return false;
      if (tradingPartner && process.tradingPartner !== tradingPartner) return false;
      if (startDate && new Date(process.startTime) < new Date(startDate)) return false;
      if (endDate && new Date(process.startTime) > new Date(endDate)) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          process.processName.toLowerCase().includes(searchLower) ||
          process.processId.toLowerCase().includes(searchLower) ||
          process.tradingPartner.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // Apply sorting
    filteredProcesses.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'startTime') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProcesses = filteredProcesses.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalItems = filteredProcesses.length;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      data: paginatedProcesses,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        environment,
        status,
        tradingPartner,
        startDate,
        endDate,
        search
      }
    });

  } catch (error) {
    console.error('Process fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/processes/dashboard
 * Get dashboard summary statistics
 */
router.get('/dashboard', (req, res) => {
  try {
    const summary = generateDashboardSummary(mockProcesses);
    res.json(summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/processes/:id
 * Get detailed information about a specific process
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const process = mockProcesses.find(p => p.id.toString() === id);
    
    if (!process) {
      return res.status(404).json({ message: 'Process not found' });
    }

    res.json(process);
  } catch (error) {
    console.error('Process detail fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/processes/:id/logs
 * Get execution logs for a specific process
 */
router.get('/:id/logs', (req, res) => {
  try {
    const { id } = req.params;
    const process = mockProcesses.find(p => p.id.toString() === id);
    
    if (!process) {
      return res.status(404).json({ message: 'Process not found' });
    }

    // Generate mock logs based on process status
    const logs = generateMockLogs(process);
    
    res.json({ logs });
  } catch (error) {
    console.error('Process logs fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/processes/:id/retry
 * Retry a failed process (admin only)
 */
router.post('/:id/retry', requireRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const process = mockProcesses.find(p => p.id.toString() === id);
    
    if (!process) {
      return res.status(404).json({ message: 'Process not found' });
    }

    if (process.status !== 'Failed') {
      return res.status(400).json({ message: 'Only failed processes can be retried' });
    }

    // Create a new process instance for retry
    const retryProcess = generateMockProcess(mockProcesses.length + 1, {
      processId: process.processId + '_RETRY',
      processName: process.processName,
      environment: process.environment,
      tradingPartner: process.tradingPartner,
      status: 'In Progress',
      startTime: new Date().toISOString()
    });

    mockProcesses.unshift(retryProcess);

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.to('dashboard').emit('process-update', {
      type: 'retry',
      process: retryProcess
    });

    res.json({
      message: 'Process retry initiated',
      newProcess: retryProcess
    });

  } catch (error) {
    console.error('Process retry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/processes/metadata/filters
 * Get available filter options
 */
router.get('/metadata/filters', (req, res) => {
  try {
    const uniqueTradingPartners = [...new Set(mockProcesses.map(p => p.tradingPartner))].sort();
    
    res.json({
      environments: ENVIRONMENTS,
      statuses: STATUSES,
      tradingPartners: uniqueTradingPartners
    });
  } catch (error) {
    console.error('Filter metadata error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Generate mock execution logs for a process
 */
const generateMockLogs = (process) => {
  const logs = [];
  const logTypes = ['INFO', 'DEBUG', 'WARN', 'ERROR'];
  
  // Generate logs based on process status and duration
  const logCount = process.status === 'Failed' ? 15 : 10;
  
  for (let i = 0; i < logCount; i++) {
    const timestamp = new Date(
      new Date(process.startTime).getTime() + (i * (process.executionTime || 60000) / logCount)
    );
    
    let logType = 'INFO';
    let message = 'Process execution step completed successfully';
    
    if (i === logCount - 1 && process.status === 'Failed') {
      logType = 'ERROR';
      message = process.errorDetails?.message || 'Process execution failed';
    } else if (i > logCount * 0.7 && process.status === 'Warning') {
      logType = 'WARN';
      message = 'Performance threshold exceeded, consider optimization';
    }
    
    logs.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      level: logType,
      message,
      component: 'ExecutionEngine',
      details: logType === 'ERROR' ? process.errorDetails : null
    });
  }
  
  return logs;
};

// Simulate real-time process updates
setInterval(() => {
  const inProgressProcesses = mockProcesses.filter(p => p.status === 'In Progress');
  
  inProgressProcesses.forEach(process => {
    // Randomly complete some in-progress processes
    if (Math.random() < 0.1) { // 10% chance per interval
      const success = Math.random() > 0.2; // 80% success rate
      process.status = success ? 'Success' : 'Failed';
      process.endTime = new Date().toISOString();
      process.executionTime = new Date(process.endTime) - new Date(process.startTime);
      process.updatedAt = new Date().toISOString();
      
      if (!success) {
        process.errorDetails = {
          errorCode: 'ERR_TIMEOUT',
          errorType: 'Connection timeout',
          message: 'Connection timeout after 30 seconds',
          timestamp: new Date().toISOString(),
          retryable: true,
          retryCount: 0
        };
      }
      
      // Would emit to all connected clients in a real app
      console.log(`Process ${process.processId} completed with status: ${process.status}`);
    }
  });
}, 10000); // Check every 10 seconds

module.exports = router;
