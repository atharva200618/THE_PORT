/**
 * The Port — API Client & Job Polling Utility
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Checks if the backend server is reachable
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch (err) {
    // Backend is offline
  }
  return { online: false };
}

/**
 * Fetches the live Mac Worker status & heartbeat
 */
export async function fetchWorkerStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/worker/status`, { method: 'GET' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Worker offline / backend unreachable
  }
  return { online: false, lastSeen: null, stats: null };
}

/**
 * Enqueues a conversion job on the Backend API
 */
export async function submitConversionJob(file, targetFormat, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  if (options && options.password) {
    formData.append('password', options.password);
  }

  const response = await fetch(`${API_BASE_URL}/api/convert`, {
    method: 'POST',
    body: formData
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    let errorMsg = `Server error (HTTP ${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) errorMsg = errorJson.error;
    } catch {
      if (!contentType.includes('application/json')) {
        errorMsg = 'Native M1 Engine is offline on this cloud URL. Please test on http://localhost:3000 to use your Mac hardware accelerator.';
      }
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data || !data.jobId) {
    throw new Error('Invalid response from conversion API');
  }
  return data;
}

/**
 * Merges multiple PDF files into a single unified document
 */
export async function submitMergePdfsJob(filesList, outputName = 'Merged_Document.pdf') {
  const formData = new FormData();
  for (const f of filesList) {
    const fileObj = f instanceof File ? f : f.file || f;
    formData.append('files', fileObj);
  }
  formData.append('outputName', outputName);

  const response = await fetch(`${API_BASE_URL}/api/jobs/merge`, {
    method: 'POST',
    body: formData
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    let errorMsg = `PDF Merge failed (HTTP ${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) errorMsg = errorJson.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Fetches current job status
 */
export async function fetchJobStatus(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`);
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    throw new Error(`Failed to fetch job status (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!data || !data.status) {
    throw new Error('Malformed job status response from engine');
  }
  return data;
}

/**
 * Immediately deletes a job and its files from the server
 */
export async function deleteJobFromServer(jobId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete job from server:', err);
    return false;
  }
}

/**
 * Returns full download URL for completed job
 */
export function getDownloadUrl(jobId) {
  return `${API_BASE_URL}/api/jobs/${jobId}/download`;
}

/**
 * Returns inline viewing URL for completed PDF job (opens in tab without downloading)
 */
export function getViewUrl(jobId) {
  return `${API_BASE_URL}/api/jobs/${jobId}/view`;
}

/**
 * Returns live preview URL for completed job
 */
export function getPreviewUrl(jobId) {
  return `${API_BASE_URL}/api/jobs/${jobId}/preview`;
}

/**
 * Client-Side Fallback Simulation (Used if backend is offline/previewing)
 */
export async function simulateClientConversion(file, targetFormat, onProgress) {
  const steps = [
    { text: 'Engaging Port Gate...', pct: 20, delay: 250 },
    { text: 'Crossing over territory seam...', pct: 45, delay: 300 },
    { 
      text: targetFormat === 'pages' 
        ? 'Synthesizing Apple iWork vector canvas...' 
        : targetFormat === 'docx' 
        ? 'Mapping OpenXML print baseline grid...' 
        : 'Compiling PDF viewport layout...', 
      pct: 75, 
      delay: 350 
    },
    { text: `Finalizing .${targetFormat} package...`, pct: 100, delay: 200 }
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) {
      onProgress({
        step: i + 1,
        total: steps.length,
        statusText: steps[i].text,
        progressPercent: steps[i].pct
      });
    }
    await new Promise((r) => setTimeout(r, steps[i].delay));
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outputFileName = `${baseName}.${targetFormat}`;
  
  let mimeType = 'application/octet-stream';
  let dummyContent = `Generated by The Port\nOriginal: ${file.name}\nTarget: .${targetFormat}\nTimestamp: ${new Date().toISOString()}`;
  
  if (targetFormat === 'pdf') {
    mimeType = 'application/pdf';
    dummyContent = `%PDF-1.4\n1 0 obj\n<< /Title (${outputFileName}) /Producer (The Port) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
  } else if (targetFormat === 'docx') {
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (targetFormat === 'pages') {
    mimeType = 'application/x-iwork-pages-sffpages';
  }

  const blob = new Blob([dummyContent], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);

  return {
    id: `local_${Date.now()}`,
    originalName: file.name,
    originalSize: formatBytes(file.size),
    sourceFormat: (file.name.split('.').pop() || '').toLowerCase(),
    targetFormat,
    outputName: outputFileName,
    downloadUrl,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'done',
    isLocalFallback: true
  };
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
