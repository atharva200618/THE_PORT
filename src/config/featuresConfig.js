import {
  ApplePagesIcon,
  MicrosoftWordIcon,
  AppleNumbersIcon,
  MicrosoftExcelIcon,
  AppleKeynoteIcon,
  MicrosoftPowerPointIcon,
  AdobePdfIcon
} from '../components/BrandIcons';

export const MODES = {
  documents: {
    id: 'documents',
    name: 'Documents',
    shortName: 'Docs',
    headline: 'Pages ↔ Microsoft Word',
    desc: 'High-fidelity bidirectional conversion between Apple Pages, Microsoft Word, and Vector PDF.',
    placeholder: 'Drop your .pages, .docx, .doc, or .pdf documents...',
    accept: '.pages,.docx,.doc,.pdf,.txt',
    primaryTarget: 'docx',
    presets: [
      { id: 'pages-to-word', label: 'Pages → Word (.docx)', sample: 'pages', target: 'docx', SourceIcon: ApplePagesIcon, TargetIcon: MicrosoftWordIcon },
      { id: 'word-to-pages', label: 'Word → Pages (.pages)', sample: 'docx', target: 'pages', SourceIcon: MicrosoftWordIcon, TargetIcon: ApplePagesIcon },
      { id: 'doc-to-pdf', label: 'Document → PDF', sample: 'docx', target: 'pdf', SourceIcon: MicrosoftWordIcon, TargetIcon: AdobePdfIcon }
    ]
  },
  spreadsheets: {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    shortName: 'Sheets',
    headline: 'Numbers ↔ Microsoft Excel',
    desc: 'Native spreadsheet calculations, multi-table sheets, and formula-preserving grid exports.',
    placeholder: 'Drop your .numbers, .xlsx, .xls, or .csv sheets...',
    accept: '.numbers,.xlsx,.xls,.csv,.pdf',
    primaryTarget: 'xlsx',
    presets: [
      { id: 'numbers-to-excel', label: 'Numbers → Excel (.xlsx)', sample: 'numbers', target: 'xlsx', SourceIcon: AppleNumbersIcon, TargetIcon: MicrosoftExcelIcon },
      { id: 'excel-to-numbers', label: 'Excel → Numbers (.numbers)', sample: 'xlsx', target: 'numbers', SourceIcon: MicrosoftExcelIcon, TargetIcon: AppleNumbersIcon },
      { id: 'sheet-to-csv', label: 'Export Table (.csv)', sample: 'numbers', target: 'csv', SourceIcon: AppleNumbersIcon, TargetIcon: MicrosoftExcelIcon }
    ]
  },
  presentations: {
    id: 'presentations',
    name: 'Presentations',
    shortName: 'Slides',
    headline: 'Keynote ↔ PowerPoint',
    desc: '16:9 cinema presentations, slide masters, typography, and vector graphics preservation.',
    placeholder: 'Drop your .key, .pptx, or .ppt presentations...',
    accept: '.key,.pptx,.ppt,.pdf',
    primaryTarget: 'pptx',
    presets: [
      { id: 'keynote-to-pptx', label: 'Keynote → PowerPoint (.pptx)', sample: 'key', target: 'pptx', SourceIcon: AppleKeynoteIcon, TargetIcon: MicrosoftPowerPointIcon },
      { id: 'pptx-to-keynote', label: 'PowerPoint → Keynote (.key)', sample: 'pptx', target: 'key', SourceIcon: MicrosoftPowerPointIcon, TargetIcon: AppleKeynoteIcon },
      { id: 'deck-to-pdf', label: 'Presentation → PDF Slides', sample: 'key', target: 'pdf', SourceIcon: AppleKeynoteIcon, TargetIcon: AdobePdfIcon }
    ]
  },
  utilities: {
    id: 'utilities',
    name: 'PDF & Tools',
    shortName: 'Tools',
    headline: 'PDF Compressor & Multi-Tool',
    desc: 'Smart PDF Compressor (-75%), Multi-PDF Merge, Page Splitter, Watermark, OCR, and reverse-engineering to Pages/Word.',
    placeholder: 'Drop photos/screenshots (.png, .jpg, .heic) or .pdf to compress/merge...',
    accept: '.pdf,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.bmp',
    primaryTarget: 'compress',
    presets: [
      { id: 'compress-pdf', label: 'Smart PDF Compressor (-75%)', sample: 'compress', target: 'compress', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'merge-pdfs', label: 'Merge PDFs into One', sample: 'merge', target: 'pdf', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'split-pdf', label: 'Split PDF Pages to ZIP', sample: 'split', target: 'split', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'rotate-pdf', label: 'Rotate PDF 90°', sample: 'rotate', target: 'rotate', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'watermark-pdf', label: 'Watermark PDF', sample: 'watermark', target: 'watermark', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'protect-pdf', label: 'Password Protect PDF', sample: 'protect', target: 'protect', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'ocr-pdf', label: 'OCR Scanned PDF', sample: 'ocr', target: 'ocr', SourceIcon: AdobePdfIcon, TargetIcon: AdobePdfIcon },
      { id: 'images-to-pdf', label: 'Photos / Images to PDF', sample: 'jpg', target: 'pdf', SourceIcon: AdobePdfIcon, TargetIcon: ApplePagesIcon },
      { id: 'pdf-to-pages', label: 'PDF → Apple Pages (.pages)', sample: 'pdf', target: 'pages', SourceIcon: AdobePdfIcon, TargetIcon: ApplePagesIcon },
      { id: 'pdf-to-word', label: 'PDF → Microsoft Word (.docx)', sample: 'pdf', target: 'docx', SourceIcon: AdobePdfIcon, TargetIcon: MicrosoftWordIcon }
    ]
  }
};

/**
 * Auto-detect mode from a file's extension
 */
export const detectModeFromFile = (ext = '') => {
  const cleaned = ext.toLowerCase().replace(/^\./, '');
  if (['key', 'pptx', 'ppt'].includes(cleaned)) return 'presentations';
  if (['numbers', 'xlsx', 'xls', 'csv'].includes(cleaned)) return 'spreadsheets';
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(cleaned)) return 'utilities';
  return 'documents';
};

/**
 * Get primary target format for a given mode and source format
 */
export const getTargetForMode = (sourceFormat = '', targetMode = 'documents') => {
  const src = sourceFormat.toLowerCase().replace(/^\./, '');
  if (targetMode === 'spreadsheets') {
    if (src === 'numbers') return 'xlsx';
    if (src === 'xlsx' || src === 'xls' || src === 'csv') return 'numbers';
    return 'xlsx';
  }
  if (targetMode === 'presentations') {
    if (src === 'key') return 'pptx';
    if (src === 'pptx' || src === 'ppt') return 'key';
    return 'pptx';
  }
  if (targetMode === 'utilities') {
    if (src === 'pdf') return 'compress';
    return 'pdf';
  }
  // documents
  if (src === 'pages') return 'docx';
  if (src === 'docx' || src === 'doc') return 'pages';
  return 'docx';
};
