import { useState, useEffect, useCallback } from 'react';
import { fetchWorkerStatus } from '../utils/api';

/**
 * Custom hook to monitor live Mac M1 worker heartbeat and status
 */
export function useWorkerStatus(pollIntervalMs = 6000) {
  const [workerStatus, setWorkerStatus] = useState({ online: false });

  const checkStatus = useCallback(async () => {
    try {
      const status = await fetchWorkerStatus();
      setWorkerStatus(status || { online: false });
    } catch {
      setWorkerStatus({ online: false });
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, pollIntervalMs);
    return () => clearInterval(interval);
  }, [checkStatus, pollIntervalMs]);

  return {
    workerStatus,
    setWorkerStatus,
    checkStatus
  };
}

export default useWorkerStatus;
