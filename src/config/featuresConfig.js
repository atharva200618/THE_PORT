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
 * Get compatible modes for a given source extension
 */
export const getCompatibleModes = (sourceFormat = '') => {
  const ext = (sourceFormat || '').toLowerCase().replace(/^\./, '');
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(ext)) {
    return [MODES.utilities];
  }
  if (ext === 'pdf') {
    return [MODES.documents, MODES.utilities];
  }
  if (ext === 'docx' || ext === 'doc' || ext === 'pages' || ext === 'txt') {
    return [MODES.documents];
  }
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv' || ext === 'numbers') {
    return [MODES.spreadsheets];
  }
  if (ext === 'pptx' || ext === 'ppt' || ext === 'key') {
    return [MODES.presentations];
  }
  return [MODES.documents, MODES.utilities];
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
  if (src === 'pdf') return 'pages';
  return 'docx';
};

/**
 * Premium Human-Grade Action Details Formatter
 * Eliminates raw extension leaks (e.g. "Convert to .compress") and returns high-touch verbs
 */
export const getTargetActionDetails = (sourceFormat = '', targetFormat = '') => {
  const src = (sourceFormat || '').toLowerCase().replace(/^\./, '');
  const tgt = (targetFormat || '').toLowerCase().replace(/^\./, '');

  switch (tgt) {
    case 'compress':
      return {
        label: 'Compress PDF Streams (-75%)',
        shortLabel: 'Compress PDF',
        badge: '-75%',
        iconType: 'compress',
        gradient: 'from-amber-600 to-orange-600'
      };
    case 'protect':
      return {
        label: 'Protect PDF with Password',
        shortLabel: 'Protect PDF',
        badge: 'AES-256',
        iconType: 'protect',
        gradient: 'from-amber-600 to-yellow-600'
      };
    case 'split':
      return {
        label: 'Split PDF Pages to ZIP',
        shortLabel: 'Split Pages',
        badge: '.zip',
        iconType: 'split',
        gradient: 'from-blue-600 to-indigo-600'
      };
    case 'rotate':
      return {
        label: 'Rotate PDF 90° Clockwise',
        shortLabel: 'Rotate 90°',
        badge: '90° CW',
        iconType: 'rotate',
        gradient: 'from-blue-600 to-cyan-600'
      };
    case 'watermark':
      return {
        label: 'Apply Watermark to PDF',
        shortLabel: 'Watermark PDF',
        badge: 'Watermark',
        iconType: 'watermark',
        gradient: 'from-indigo-600 to-purple-600'
      };
    case 'ocr':
      return {
        label: 'Synthesize OCR Searchable PDF',
        shortLabel: 'OCR Searchable',
        badge: 'OCR',
        iconType: 'ocr',
        gradient: 'from-emerald-600 to-teal-600'
      };
    case 'pages':
      return {
        label: 'Convert to Apple Pages (.pages)',
        shortLabel: 'To Apple Pages',
        badge: '.pages',
        iconType: 'pages',
        gradient: 'from-blue-600 to-indigo-600'
      };
    case 'docx':
      return {
        label: 'Convert to Microsoft Word (.docx)',
        shortLabel: 'To Word (.docx)',
        badge: '.docx',
        iconType: 'docx',
        gradient: 'from-blue-700 to-sky-700'
      };
    case 'pdf':
      if (src === 'key' || src === 'pptx') {
        return {
          label: 'Export Presentation as PDF Slides',
          shortLabel: 'Export PDF Slides',
          badge: '.pdf',
          iconType: 'pdf',
          gradient: 'from-rose-600 to-red-700'
        };
      }
      if (src === 'numbers' || src === 'xlsx') {
        return {
          label: 'Export Spreadsheet as PDF Canvas',
          shortLabel: 'Export PDF Canvas',
          badge: '.pdf',
          iconType: 'pdf',
          gradient: 'from-emerald-600 to-teal-700'
        };
      }
      return {
        label: 'Compile Vector PDF Document',
        shortLabel: 'Export PDF',
        badge: '.pdf',
        iconType: 'pdf',
        gradient: 'from-rose-600 to-red-700'
      };
    case 'xlsx':
      return {
        label: 'Convert to Microsoft Excel (.xlsx)',
        shortLabel: 'To Excel (.xlsx)',
        badge: '.xlsx',
        iconType: 'xlsx',
        gradient: 'from-emerald-600 to-green-700'
      };
    case 'numbers':
      return {
        label: 'Convert to Apple Numbers (.numbers)',
        shortLabel: 'To Apple Numbers',
        badge: '.numbers',
        iconType: 'numbers',
        gradient: 'from-emerald-600 to-teal-700'
      };
    case 'csv':
      return {
        label: 'Export Table Data as CSV (.csv)',
        shortLabel: 'Export CSV',
        badge: '.csv',
        iconType: 'csv',
        gradient: 'from-emerald-700 to-teal-800'
      };
    case 'pptx':
      return {
        label: 'Convert to PowerPoint (.pptx)',
        shortLabel: 'To PowerPoint',
        badge: '.pptx',
        iconType: 'pptx',
        gradient: 'from-orange-600 to-red-600'
      };
    case 'key':
      return {
        label: 'Convert to Apple Keynote (.key)',
        shortLabel: 'To Apple Keynote',
        badge: '.key',
        iconType: 'key',
        gradient: 'from-blue-600 to-indigo-600'
      };
    default:
      return {
        label: `Convert to .${tgt.toUpperCase()}`,
        shortLabel: `Convert to .${tgt}`,
        badge: `.${tgt}`,
        iconType: 'default',
        gradient: 'from-zinc-900 to-black'
      };
  }
};
