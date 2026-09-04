import { useState, useCallback } from 'react';

/**
 * Mode Auto-detection helper
 */
export const detectModeFromFile = (ext = '') => {
  const cleaned = ext.toLowerCase().replace(/^\./, '');
  if (['key', 'pptx', 'ppt'].includes(cleaned)) return 'presentations';
  if (['numbers', 'xlsx', 'xls', 'csv'].includes(cleaned)) return 'spreadsheets';
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif'].includes(cleaned)) return 'utilities';
  return 'documents';
};

/**
 * Determine territory from filename (Apple iWork -> Glass, Universal/PC/Images -> Paper)
 */
export const getFileTerritory = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pages', 'key', 'numbers'].includes(ext)) return 'glass';
  return 'paper';
};

/**
 * Determine sensible default target format based on source extension
 */
export const getDefaultTargetFormat = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
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
 * Custom hook for staging, appending, removing, and mode/territory detection
 */
export function useFileStaging() {
  const [activeMode, setActiveMode] = useState('documents');
  const [stagedFiles, setStagedFiles] = useState([]);
  const [selectedTargetFormat, setSelectedTargetFormat] = useState('pages');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const activeFile = stagedFiles.length > 0 ? stagedFiles[0] : null;
  const sourceTerritory = activeFile ? getFileTerritory(activeFile.name) : 'paper';

  // Add / Append new files to the staging queue (avoiding exact duplicates)
  const handleAppendFiles = useCallback((incoming) => {
    setErrorMessage(null);
    const incomingList = Array.isArray(incoming) ? incoming : [incoming];
    if (incomingList.length === 0) return;

    // Auto-detect & switch active mode based on dropped file
    const firstExt = (incomingList[0].name.split('.').pop() || '').toLowerCase();
    const detected = detectModeFromFile(firstExt);
    setActiveMode(detected);

    setStagedFiles((prev) => {
      const baseList = [...prev];
      for (const newF of incomingList) {
        if (!baseList.some((item) => item.name === newF.name && item.size === newF.size)) {
          baseList.push(newF);
        }
      }
      return baseList;
    });

    // Update target format default
    setSelectedTargetFormat(getDefaultTargetFormat(incomingList[0].name));
  }, []);

  // Remove a specific file or category from staging
  const handleRemoveStagedFile = useCallback((fileName) => {
    if (fileName === 'ALL_PAPER') {
      setStagedFiles((prev) =>
        prev.filter((f) => {
          const ext = (f.name.split('.').pop() || '').toLowerCase();
          return ['pages', 'key', 'numbers'].includes(ext);
        })
      );
    } else if (fileName === 'ALL_GLASS') {
      setStagedFiles((prev) =>
        prev.filter((f) => {
          const ext = (f.name.split('.').pop() || '').toLowerCase();
          return !['pages', 'key', 'numbers'].includes(ext);
        })
      );
    } else {
      setStagedFiles((prev) => prev.filter((f) => f.name !== fileName));
    }
  }, []);

  // Global Drag & Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (e.clientX <= 0 || e.clientY <= 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleAppendFiles(droppedFiles);
    }
  }, [handleAppendFiles]);

  // Sample document selector across all modes
  const handleSelectSample = useCallback((format) => {
    let name = 'Executive_Strategic_Brief.docx';
    let size = 284000;
    if (format === 'pdf') {
      name = 'Architectural_Blueprint.pdf';
      size = 512000;
    } else if (format === 'compress') {
      name = 'Oversized_Report_To_Compress.pdf';
      size = 8500000;
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

    const sampleFile = new File(['The Port Sample Document Content'], name, { type: 'application/octet-stream' });
    Object.defineProperty(sampleFile, 'size', { value: size });
    handleAppendFiles([sampleFile]);
  }, [handleAppendFiles]);

  return {
    activeMode,
    setActiveMode,
    stagedFiles,
    setStagedFiles,
    selectedTargetFormat,
    setSelectedTargetFormat,
    isDraggingOver,
    setIsDraggingOver,
    errorMessage,
    setErrorMessage,
    activeFile,
    sourceTerritory,
    detectModeFromFile,
    getFileTerritory,
    getDefaultTargetFormat,
    handleAppendFiles,
    handleRemoveStagedFile,
    handleSelectSample,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}

export default useFileStaging;
