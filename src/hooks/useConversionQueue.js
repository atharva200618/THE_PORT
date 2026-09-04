import { useState, useCallback, useRef } from 'react';
import {
  submitConversionJob,
  submitMergePdfsJob,
  fetchJobStatus,
  getDownloadUrl,
  simulateClientConversion,
  deleteJobFromServer,
  formatBytes
} from '../utils/api';
import { sounds } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

/**
 * Format appropriate output name based on target format
 */
export const formatOutputName = (filename = '', targetFormat = '') => {
  const baseName = filename.replace(/\.[^/.]+$/, '');
  const fmt = targetFormat.toLowerCase();
  if (fmt === 'split') return `${baseName}_pages.zip`;
  if (fmt === 'compress') return `${baseName}_compressed.pdf`;
  if (fmt === 'rotate') return `${baseName}_rotated.pdf`;
  if (fmt === 'watermark') return `${baseName}_watermarked.pdf`;
  if (fmt === 'protect') return `${baseName}_protected.pdf`;
  if (fmt === 'unprotect') return `${baseName}_unprotected.pdf`;
  if (fmt === 'ocr') return `${baseName}_ocr.pdf`;
  return `${baseName}.${targetFormat}`;
};

/**
 * Determine sensible default target format based on source extension
 */
export const getDefaultTargetFormat = (filename = '') => {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(ext)) return 'pdf';
  if (ext === 'pages') return 'docx';
  if (ext === 'docx' || ext === 'doc' || ext === 'pdf') return 'pages';
  if (ext === 'key') return 'pptx';
  if (ext === 'pptx' || ext === 'ppt') return 'key';
  if (ext === 'numbers') return 'xlsx';
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'numbers';
  return 'pages';
};

/**
 * Single-State Conversion Queue Hook
 * Replaces disconnected states with a unified `files` array
 */
export function useConversionQueue(soundEnabled = true) {
  const [files, setFiles] = useState([]);
  const activeJobsRef = useRef(new Set());

  // Add / Append new files to the staging queue (deduplicating by name + size)
  const addFiles = useCallback((incoming, overrideTarget) => {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    if (list.length === 0) return;

    setFiles((prev) => {
      const updated = [...prev];
      for (const item of list) {
        const fileObj = item instanceof File ? item : item.file || item;
        const name = fileObj.name || 'document';
        const size = fileObj.size || 0;
        const exists = updated.some(f => f.name === name && f.file?.size === size);
        if (!exists) {
          const sourceExt = (name.split('.').pop() || '').toLowerCase();
          const targetExt = overrideTarget || getDefaultTargetFormat(name);
          updated.push({
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            file: fileObj,
            name: name,
            sourceFormat: sourceExt,
            targetFormat: targetExt,
            status: 'idle',
            progress: 0,
            statusText: 'Ready for conversion',
            downloadUrl: null,
            error: null,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            originalSize: size ? formatBytes(size) : '',
            outputName: formatOutputName(name, targetExt)
          });
        }
      }
      return updated;
    });
  }, []);

  // Remove a specific file by ID
  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  // Change target format for a specific file
  const setTargetFormat = useCallback((id, newTargetFormat) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            targetFormat: newTargetFormat,
            outputName: formatOutputName(f.name, newTargetFormat)
          };
        }
        return f;
      })
    );
  }, []);

  // Convert a single file by ID
  const startConversion = useCallback(
    async (fileId) => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === fileId);
        if (!target || target.status === 'converting') return prev;
        return prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'converting', progress: 15, statusText: 'Initializing passage…', error: null }
            : f
        );
      });

      const currentFile = files.find((f) => f.id === fileId);
      if (!currentFile || !currentFile.file) return;

      const { file, name, sourceFormat, targetFormat } = currentFile;
      if (soundEnabled) sounds.playGateTransit();

      try {
        // Attempt backend conversion job
        const job = await submitConversionJob(file, targetFormat);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 35, statusText: 'Engaging Port Gate on Mac Worker…' }
              : f
          )
        );

        const pollInterval = 1500;
        const maxAttempts = 80;
        let attempts = 0;
        let result = null;

        while (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, pollInterval));
          attempts++;

          const jobStatus = await fetchJobStatus(job.jobId);
          if (jobStatus.status === 'processing' || jobStatus.status === 'pending') {
            const dynamicText = ['pages', 'key', 'numbers'].includes(targetFormat)
              ? 'Synthesizing Apple iWork vector canvas…'
              : targetFormat === 'docx' || targetFormat === 'xlsx' || targetFormat === 'pptx'
              ? 'Mapping OpenXML baseline grid…'
              : targetFormat === 'compress'
              ? 'Optimizing & compressing PDF streams…'
              : targetFormat === 'split'
              ? 'Splitting PDF pages into ZIP archive…'
              : targetFormat === 'rotate'
              ? 'Applying 90° clockwise rotation…'
              : targetFormat === 'watermark'
              ? 'Embedding centered watermark layer…'
              : targetFormat === 'protect'
              ? 'Applying 128-bit AES encryption…'
              : targetFormat === 'ocr'
              ? 'Extracting & synthesizing OCR layer…'
              : 'Rendering high-fidelity vector layout…';

            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, progress: Math.min(92, 35 + attempts * 4), statusText: dynamicText }
                  : f
              )
            );
          } else if (jobStatus.status === 'done') {
            result = {
              downloadUrl: getDownloadUrl(jobStatus.id),
              outputName: formatOutputName(jobStatus.originalName || name, jobStatus.targetFormat)
            };
            break;
          } else if (jobStatus.status === 'failed') {
            throw new Error(jobStatus.error || `Conversion failed for ${name}.`);
          }
        }

        if (!result && attempts >= maxAttempts) {
          throw new Error(`Conversion timed out for ${name}.`);
        }

        // Success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'done',
                  progress: 100,
                  statusText: 'Conversion complete',
                  downloadUrl: result.downloadUrl,
                  outputName: result.outputName
                }
              : f
          )
        );
        if (soundEnabled) sounds.playSnap();
        triggerHaptic('success');
      } catch (err) {
        console.warn('Backend conversion notice, checking sample simulation:', err.message);
        const isSample =
          name.includes('Sample') ||
          name.includes('Executive') ||
          name.includes('Architectural') ||
          name.includes('Product') ||
          name.includes('Financial') ||
          name.includes('Showcase') ||
          name.includes('Contract') ||
          name.includes('Receipt') ||
          name.includes('Invoice');

        if (isSample) {
          try {
            const simResult = await simulateClientConversion(file, targetFormat, (step) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId
                    ? { ...f, progress: step.progressPercent, statusText: step.statusText }
                    : f
                )
              );
            });
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? {
                      ...f,
                      status: 'done',
                      progress: 100,
                      statusText: 'Conversion complete',
                      downloadUrl: simResult.downloadUrl,
                      outputName: formatOutputName(name, targetFormat)
                    }
                  : f
              )
            );
            if (soundEnabled) sounds.playSnap();
            triggerHaptic('success');
            return;
          } catch (simErr) {
            console.error('Simulation error:', simErr);
          }
        }

        // Error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'error',
                  progress: 0,
                  statusText: 'Conversion failed',
                  error: err.message
                }
              : f
          )
        );
        triggerHaptic('error');
      }
    },
    [files, soundEnabled]
  );

  // Helper to identify if a job touches Apple GUI apps (Pages, Keynote, Numbers)
  const isAppleJob = useCallback((item) => {
    const src = (item.sourceFormat || '').toLowerCase();
    const tgt = (item.targetFormat || '').toLowerCase();
    return ['pages', 'key', 'numbers'].includes(src) || ['pages', 'key', 'numbers'].includes(tgt);
  }, []);

  // Convert all idle / error files: Parallel for LibreOffice/Python, Serial for Apple GUI apps
  const startAllConversions = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'idle' || f.status === 'error');
    if (pendingFiles.length === 0) return;

    const appleJobs = pendingFiles.filter(isAppleJob);
    const parallelJobs = pendingFiles.filter((f) => !isAppleJob(f));

    // 1. Run non-Apple parallel jobs (concurrency pool of 3)
    const runParallelBatch = async () => {
      if (parallelJobs.length === 0) return;
      const CONCURRENCY_LIMIT = 3;
      const executing = new Set();

      for (const job of parallelJobs) {
        const promise = (async () => {
          activeJobsRef.current.add(job.id);
          try {
            await startConversion(job.id);
          } finally {
            activeJobsRef.current.delete(job.id);
            executing.delete(promise);
          }
        })();

        executing.add(promise);
        if (executing.size >= CONCURRENCY_LIMIT) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
    };

    // 2. Run Apple jobs strictly sequentially (one by one) to protect GUI stability
    const runAppleBatch = async () => {
      for (const job of appleJobs) {
        activeJobsRef.current.add(job.id);
        try {
          await startConversion(job.id);
        } finally {
          activeJobsRef.current.delete(job.id);
        }
      }
    };

    // Parallel batch and Apple batch run alongside each other, with Apple jobs strictly serialized
    await Promise.all([runParallelBatch(), runAppleBatch()]);
  }, [files, startConversion, isAppleJob]);

  // Multi-PDF Merge operation
  const mergePdfs = useCallback(
    async (outputName = 'Merged_Collection.pdf') => {
      const pdfFiles = files.filter((f) => f.sourceFormat === 'pdf' && f.file);
      if (pdfFiles.length < 2) return;

      const mergeId = `merge_${Date.now()}`;
      const totalBytes = pdfFiles.reduce((acc, f) => acc + (f.file?.size || 0), 0);

      const mergeCard = {
        id: mergeId,
        file: null,
        name: outputName,
        sourceFormat: 'pdf',
        targetFormat: 'pdf',
        status: 'converting',
        progress: 25,
        statusText: `Merging ${pdfFiles.length} PDF documents…`,
        downloadUrl: null,
        error: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalSize: formatBytes(totalBytes),
        outputName: outputName
      };

      setFiles((prev) => [mergeCard, ...prev]);
      if (soundEnabled) sounds.playGateTransit();

      try {
        const res = await submitMergePdfsJob(
          pdfFiles.map((f) => f.file),
          outputName
        );

        if (res.status === 'done') {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === mergeId
                ? {
                    ...f,
                    status: 'done',
                    progress: 100,
                    statusText: 'Merge complete',
                    downloadUrl: res.downloadUrl,
                    outputName: res.outputName || outputName
                  }
                : f
            )
          );
          if (soundEnabled) sounds.playSnap();
          triggerHaptic('success');
        } else if (res.jobId) {
          const pollInterval = 1500;
          const maxAttempts = 60;
          let attempts = 0;
          let done = false;

          while (attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, pollInterval));
            attempts++;
            const jobStatus = await fetchJobStatus(res.jobId);
            if (jobStatus.status === 'done') {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === mergeId
                    ? {
                        ...f,
                        status: 'done',
                        progress: 100,
                        statusText: 'Merge complete',
                        downloadUrl: getDownloadUrl(jobStatus.id),
                        outputName: outputName
                      }
                    : f
                )
              );
              if (soundEnabled) sounds.playSnap();
              triggerHaptic('success');
              done = true;
              break;
            } else if (jobStatus.status === 'failed') {
              throw new Error(jobStatus.error || 'Merge failed.');
            }
          }
          if (!done) throw new Error('Merge timed out.');
        }
      } catch (err) {
        console.error('Merge error:', err);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === mergeId
              ? {
                  ...f,
                  status: 'error',
                  progress: 0,
                  statusText: 'Merge failed',
                  error: err.message
                }
              : f
          )
        );
        triggerHaptic('error');
      }
    },
    [files, soundEnabled]
  );

  // Delete conversion from server and state
  const deleteConversion = useCallback(async (id) => {
    try {
      await deleteJobFromServer(id);
    } catch {}
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Quick sample loader
  const selectSample = useCallback(
    (format) => {
      if (format === 'merge') {
        const sampleFile1 = new File(['The Port Sample PDF Document 1'], 'Annual_Report_Part1.pdf', {
          type: 'application/pdf'
        });
        Object.defineProperty(sampleFile1, 'size', { value: 380000 });
        const sampleFile2 = new File(['The Port Sample PDF Document 2'], 'Annual_Report_Part2.pdf', {
          type: 'application/pdf'
        });
        Object.defineProperty(sampleFile2, 'size', { value: 420000 });
        addFiles([sampleFile1, sampleFile2]);
        return;
      }

      let name = 'Executive_Strategic_Brief.docx';
      let size = 284000;
      let targetOverride = null;

      if (format === 'pdf') {
        name = 'Architectural_Blueprint.pdf';
        size = 512000;
      } else if (format === 'compress') {
        name = 'Oversized_Report_To_Compress.pdf';
        size = 8500000;
        targetOverride = 'compress';
      } else if (format === 'split') {
        name = 'Multi_Page_Contract.pdf';
        size = 520000;
        targetOverride = 'split';
      } else if (format === 'rotate') {
        name = 'Scanned_Receipt_Sideways.pdf';
        size = 310000;
        targetOverride = 'rotate';
      } else if (format === 'watermark') {
        name = 'Confidential_Brief_Draft.pdf';
        size = 440000;
        targetOverride = 'watermark';
      } else if (format === 'protect') {
        name = 'Q4_Executive_Financials.pdf';
        size = 680000;
        targetOverride = 'protect';
      } else if (format === 'ocr') {
        name = 'Scanned_Paper_Invoice.pdf';
        size = 920000;
        targetOverride = 'ocr';
      } else if (format === 'jpg' || format === 'png') {
        name = 'Screenshot_Portfolio_Batch.jpg';
        size = 1450000;
      } else if (format === 'pages') {
        name = 'Product_Marketing_Brief.pages';
        size = 720000;
      } else if (format === 'xlsx') {
        name = 'Annual_Financial_Model.xlsx';
        size = 450000;
      } else if (format === 'csv') {
        name = 'Global_Metrics_Export.csv';
        size = 180000;
      } else if (format === 'numbers') {
        name = 'Q4_Operating_Budget.numbers';
        size = 890000;
      } else if (format === 'pptx') {
        name = 'Series_A_Pitch_Deck.pptx';
        size = 1200000;
      } else if (format === 'key') {
        name = 'Apple_Keynote_Showcase.key';
        size = 1600000;
      }

      const sampleFile = new File(['The Port Sample Document Content'], name, {
        type: 'application/octet-stream'
      });
      Object.defineProperty(sampleFile, 'size', { value: size });
      addFiles([sampleFile], targetOverride);
    },
    [addFiles]
  );

  const isConverting = files.some((f) => f.status === 'converting');

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    clearAll,
    setTargetFormat,
    startConversion,
    startAllConversions,
    mergePdfs,
    deleteConversion,
    selectSample,
    isConverting
  };
}

export default useConversionQueue;
