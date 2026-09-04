import { useState, useCallback } from 'react';
import {
  submitConversionJob,
  fetchJobStatus,
  getDownloadUrl,
  simulateClientConversion,
  deleteJobFromServer,
  formatBytes
} from '../utils/api';
import { sounds } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

/**
 * Custom hook to orchestrate single & batch conversion queues, status polling, and animations
 */
export function useConversionQueue({
  stagedFiles,
  setStagedFiles,
  selectedTargetFormat,
  getDefaultTargetFormat,
  soundEnabled = true,
  setErrorMessage
}) {
  const [isConverting, setIsConverting] = useState(false);
  const [activeConversion, setActiveConversion] = useState(null);
  const [animatingFile, setAnimatingFile] = useState(null);
  const [conversions, setConversions] = useState([]);

  // Process a single file conversion
  const convertSingleFile = useCallback(async (inputFile, targetFormat, index = 0, total = 1) => {
    const sourceExt = (inputFile.name.split('.').pop() || '').toLowerCase();
    const resolvedTarget = targetFormat || getDefaultTargetFormat(inputFile.name);

    if (sourceExt === resolvedTarget && resolvedTarget !== 'pdf' && resolvedTarget !== 'compress') {
      throw new Error(`Source document '${inputFile.name}' is already .${sourceExt}.`);
    }

    const prefix = total > 1 ? `[${index + 1}/${total}] ` : '';
    const isAppleSource = ['pages', 'key', 'numbers'].includes(sourceExt);

    // 1. Trigger 600ms The Gate Morph Animation
    setAnimatingFile({
      name: inputFile.name,
      sourceType: sourceExt,
      targetType: resolvedTarget,
      direction: isAppleSource ? 'glass-to-paper' : 'paper-to-glass'
    });

    if (soundEnabled) sounds.playGateTransit();

    setActiveConversion({
      statusText: `${prefix}Crossing over ${inputFile.name}…`,
      progressPercent: 25
    });

    setTimeout(() => {
      setAnimatingFile(null);
    }, 650);

    // 2. Attempt real Backend API Job
    let result = null;
    try {
      const job = await submitConversionJob(inputFile, resolvedTarget);
      setActiveConversion({
        statusText: `${prefix}Engaging Port Gate on Mac Worker…`,
        progressPercent: 40
      });

      const pollInterval = 1500;
      const maxAttempts = 80; // 120 seconds total
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, pollInterval));
        attempts++;

        const jobStatus = await fetchJobStatus(job.jobId);
        if (jobStatus.status === 'processing' || jobStatus.status === 'pending') {
          setActiveConversion({
            statusText: ['pages', 'key', 'numbers'].includes(resolvedTarget)
              ? `${prefix}Synthesizing Apple iWork vector canvas…`
              : resolvedTarget === 'docx' || resolvedTarget === 'xlsx' || resolvedTarget === 'pptx'
              ? `${prefix}Mapping OpenXML baseline grid…`
              : `${prefix}Rendering PDF vector layout…`,
            progressPercent: Math.min(92, 40 + attempts * 4)
          });
        } else if (jobStatus.status === 'done') {
          result = {
            id: jobStatus.id,
            originalName: jobStatus.originalName,
            originalSize: formatBytes(jobStatus.fileSize),
            sourceFormat: jobStatus.sourceFormat,
            targetFormat: jobStatus.targetFormat,
            downloadUrl: getDownloadUrl(jobStatus.id),
            outputName: `${jobStatus.originalName.replace(/\.[^/.]+$/, '')}.${jobStatus.targetFormat}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'done'
          };
          break;
        } else if (jobStatus.status === 'failed') {
          throw new Error(jobStatus.error || `Conversion failed for ${inputFile.name}.`);
        }
      }

      if (!result && attempts >= maxAttempts) {
        throw new Error(`Conversion timed out for ${inputFile.name}.`);
      }
    } catch (backendErr) {
      console.warn('Backend conversion notice:', backendErr.message);
      const isSample =
        inputFile.name.includes('Sample') ||
        inputFile.name.includes('Executive') ||
        inputFile.name.includes('Architectural') ||
        inputFile.name.includes('Product');

      if (isSample) {
        result = await simulateClientConversion(inputFile, resolvedTarget, (step) => {
          setActiveConversion({
            statusText: `${prefix}${step.statusText}`,
            progressPercent: step.progressPercent
          });
        });
      } else {
        throw backendErr;
      }
    }

    if (soundEnabled) sounds.playSnap();
    return result;
  }, [getDefaultTargetFormat, soundEnabled]);

  // Batch Queue & Single Conversion Orchestration
  const startConversionSequence = useCallback(
    async (explicitTarget = null) => {
      const filesToProcess = stagedFiles.length > 0 ? stagedFiles : [];
      if (filesToProcess.length === 0 || isConverting) return;

      setIsConverting(true);
      if (setErrorMessage) setErrorMessage(null);

      try {
        for (let i = 0; i < filesToProcess.length; i++) {
          const curFile = filesToProcess[i];
          const target =
            explicitTarget ||
            (filesToProcess.length === 1 ? selectedTargetFormat : getDefaultTargetFormat(curFile.name));

          try {
            const res = await convertSingleFile(curFile, target, i, filesToProcess.length);
            if (res) {
              setConversions((prev) => [res, ...prev.filter((c) => c.id !== res.id)]);
              triggerHaptic('success');
            }
          } catch (fileErr) {
            console.error(`Error converting ${curFile.name}:`, fileErr);
            if (setErrorMessage) setErrorMessage(fileErr.message);
            triggerHaptic('error');

            // Keep workspace active by adding a failed entry
            setConversions((prev) => [
              {
                id: `fail_${Date.now()}`,
                originalName: curFile.name,
                originalSize: '',
                sourceFormat: (curFile.name.split('.').pop() || '').toLowerCase(),
                targetFormat: target,
                status: 'failed',
                error: fileErr.message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              ...prev
            ]);
          }
        }
        setStagedFiles([]);
      } finally {
        setIsConverting(false);
        setActiveConversion(null);
      }
    },
    [stagedFiles, isConverting, setErrorMessage, selectedTargetFormat, getDefaultTargetFormat, convertSingleFile, setStagedFiles]
  );

  const handleDeleteConversion = useCallback(async (id) => {
    try {
      await deleteJobFromServer(id);
    } catch (err) {
      console.warn('Failed to delete job from server:', err);
    }
    setConversions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    isConverting,
    activeConversion,
    animatingFile,
    conversions,
    setConversions,
    convertSingleFile,
    startConversionSequence,
    handleDeleteConversion
  };
}

export default useConversionQueue;
