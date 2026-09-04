import { FileText, FileSpreadsheet, Presentation, Layers, Table, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Configuration for Paper Territory (Office & Open Formats: Word, PDF, Excel, PPTX, Images)
 */
export const paperConfig = {
  id: 'paper',
  name: 'OFFICE TERRITORY',
  cardClassName: 'avero-paper-card',
  activeStageClass: 'active-stage animate-breath-amber',
  badge: {
    containerClass: 'bg-amber-500/10 border border-amber-500/20 text-amber-800',
    dotClass: 'bg-amber-500',
    label: 'OFFICE TERRITORY'
  },
  batch: {
    iconColor: 'text-amber-600',
    clearArg: 'ALL_PAPER',
    badgeClass: 'bg-[#161618] text-white',
    formatTitle: (count) => `BATCH STAGED (${count} FILES)`
  },
  singleCard: {
    headerTitle: (ext) => `${ext.toUpperCase()} DOCUMENT READY`,
    description: 'Structured with universal schemas and high-fidelity text boundaries.',
    footerIcon: CheckCircle2,
    footerIconClass: 'text-emerald-600',
    footerTextClass: 'text-emerald-700',
    footerLabel: 'Verified Native Vector'
  },
  dropzone: {
    radarClass: 'bg-amber-500/10',
    iconColor: 'text-amber-700',
    title: (exts) => `Drop ${exts.map(e => `.${e}`).join(', ')} Document`,
    subtitle: 'Drag file here or click to browse'
  },
  bottomAction: {
    addMoreLabel: () => '+ Add More Files',
    selectLabel: () => 'Select Document'
  },
  getAcceptedExtensions: (mode) => {
    if (mode === 'spreadsheets') return ['xlsx', 'xls', 'csv'];
    if (mode === 'presentations') return ['pptx', 'ppt'];
    if (mode === 'utilities') return ['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff', 'pdf'];
    return ['docx', 'doc', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'];
  },
  getModeDetails: (mode) => {
    if (mode === 'spreadsheets') {
      return {
        title: 'Excel & CSV Space',
        sub: 'Microsoft Excel (.xlsx, .xls) & CSV Data Tables',
        desc: 'Tabular calculation matrices, formula columns, and structured CSV worksheets.',
        icon: FileSpreadsheet,
        samples: [{ ext: 'xlsx', label: 'Financial_Model.xlsx' }, { ext: 'csv', label: 'Dataset.csv' }]
      };
    }
    if (mode === 'presentations') {
      return {
        title: 'PowerPoint Space',
        sub: 'Microsoft PowerPoint (.pptx)',
        desc: '16:9 widescreen slide decks, typography animations, and master presentation slides.',
        icon: Presentation,
        samples: [{ ext: 'pptx', label: 'Pitch_Deck.pptx' }]
      };
    }
    if (mode === 'utilities') {
      return {
        title: 'Images & PDF Tools',
        sub: 'Screenshots, Photos (.png, .jpg, .heic) & PDF Tools',
        desc: 'Multi-screenshot PDF binding, smart PDF compression, and high-res extraction.',
        icon: FileText,
        samples: [{ ext: 'jpg', label: 'Screenshot_Batch.jpg' }, { ext: 'pdf', label: 'Report_Compress.pdf' }]
      };
    }
    return {
      title: 'Word, PDF & Image Space',
      sub: 'Word (.docx), PDF (.pdf), Screenshots & Photos (.png, .jpg)',
      desc: 'Linear typographic documents, OpenXML formatting baselines, and multi-image binders.',
      icon: FileText,
      samples: [{ ext: 'docx', label: 'Document.docx' }, { ext: 'pdf', label: 'Document.pdf' }]
    };
  },
  getTargetOptions: ({ mode, stagedFiles, isBatch, activeExt }) => {
    if (mode === 'spreadsheets') {
      return [
        { format: 'numbers', label: isBatch ? 'Convert All to Numbers' : 'Convert to Numbers', badge: '.numbers', desc: 'Apple Numbers Table Canvas' },
        { format: 'csv', label: isBatch ? 'Convert All to CSV' : 'Convert to CSV', badge: '.csv', desc: 'Raw Comma-Separated Values' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Printable PDF Layout' }
      ];
    }
    if (mode === 'presentations') {
      return [
        { format: 'key', label: isBatch ? 'Convert All to Keynote' : 'Convert to Keynote', badge: '.key', desc: 'Apple Keynote Presentation' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF Slides' : 'Convert to PDF Slides', badge: '.pdf', desc: 'Slide Deck PDF Export' }
      ];
    }
    const isImageFile = ['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'bmp', 'tiff'].includes(activeExt);
    if (isImageFile) {
      return [
        { format: 'pdf', label: isBatch ? 'Merge All into 1 PDF' : 'Convert to PDF', badge: '.pdf', desc: 'High-Res Multi-Image PDF Document' }
      ];
    }
    const docxCount = stagedFiles.filter(f => ['docx', 'doc'].includes((f.name.split('.').pop() || '').toLowerCase())).length;
    const pdfCount = stagedFiles.filter(f => (f.name.split('.').pop() || '').toLowerCase() === 'pdf').length;
    const isMixedBatch = docxCount > 0 && pdfCount > 0;

    if (isBatch && isMixedBatch) {
      return [
        { format: 'pages', label: 'Convert All to Pages', badge: '.pages', desc: 'Universal Target for DOCX + PDF' }
      ];
    }
    if (activeExt === 'pdf') {
      return [
        { format: 'pages', label: isBatch ? 'Convert All to Pages' : 'Convert to Pages', badge: '.pages', desc: 'Apple Pages Vector Canvas' },
        { format: 'docx', label: isBatch ? 'Convert All to Word' : 'Convert to Word', badge: '.docx', desc: 'Microsoft Word OpenXML' },
        { format: 'compress', label: 'Compress PDF', badge: 'Save 70%', desc: 'Reduce File Size (Lossless Vector)' }
      ];
    }
    return [
      { format: 'pages', label: isBatch ? 'Convert All to Pages' : 'Convert to Pages', badge: '.pages', desc: 'Apple Pages Vector Canvas' },
      { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Printable Document PDF' }
    ];
  }
};

/**
 * Configuration for Glass Territory (Apple iWork Suite: Pages, Keynote, Numbers)
 */
export const glassConfig = {
  id: 'glass',
  name: 'APPLE IWORK SPACE',
  cardClassName: 'avero-glass-card',
  activeStageClass: 'active-stage animate-breath-sapphire',
  badge: {
    containerClass: 'bg-blue-500/10 border border-blue-500/20 text-blue-700',
    dotClass: 'bg-blue-600',
    label: 'APPLE IWORK SPACE'
  },
  batch: {
    iconColor: 'text-blue-600',
    clearArg: 'ALL_GLASS',
    badgeClass: 'bg-blue-600 text-white',
    formatTitle: (count, exts) => `BATCH STAGED (${count} .${(exts[0] || 'APPLE').toUpperCase()} FILES)`
  },
  singleCard: {
    headerTitle: (ext) => `APPLE ${ext.toUpperCase()} BUNDLE READY`,
    description: 'Rendered with native macOS typography, vector shapes, and Apple canvas styling.',
    footerIcon: ShieldCheck,
    footerIconClass: 'text-blue-600',
    footerTextClass: 'text-blue-700',
    footerLabel: 'Native Apple Silicon Engine'
  },
  dropzone: {
    radarClass: 'bg-blue-500/10',
    iconColor: 'text-blue-700',
    title: (exts) => `Drop .${exts[0]} File`,
    subtitle: 'Drag Apple document or click to choose'
  },
  bottomAction: {
    addMoreLabel: (exts) => `+ Add More .${exts[0]} Files`,
    selectLabel: (exts) => `Select .${exts[0]} Files`
  },
  getAcceptedExtensions: (mode) => {
    if (mode === 'spreadsheets') return ['numbers'];
    if (mode === 'presentations') return ['key'];
    return ['pages'];
  },
  getModeDetails: (mode) => {
    if (mode === 'spreadsheets') {
      return {
        title: 'Numbers Space',
        sub: 'Apple Numbers (.numbers)',
        desc: 'Interactive multi-table canvases, dynamic financial models, and Apple typography.',
        icon: Table,
        samples: [{ ext: 'numbers', label: 'Company_Budget.numbers' }]
      };
    }
    if (mode === 'presentations') {
      return {
        title: 'Keynote Space',
        sub: 'Apple Keynote (.key)',
        desc: 'Dynamic cinematic presentations, Apple vector graphics, and keynote decks.',
        icon: Presentation,
        samples: [{ ext: 'key', label: 'Investor_Pitch.key' }]
      };
    }
    return {
      title: 'Pages Space',
      sub: 'Apple Pages (.pages)',
      desc: 'Fluid vector engine with native Apple shapes, typography, and canvas layouts.',
      icon: Layers,
      samples: [{ ext: 'pages', label: 'Document.pages' }]
    };
  },
  getTargetOptions: ({ mode, isBatch }) => {
    if (mode === 'spreadsheets') {
      return [
        { format: 'xlsx', label: isBatch ? 'Convert All to Excel' : 'Convert to Excel', badge: '.xlsx', desc: 'Microsoft Excel OpenXML' },
        { format: 'csv', label: isBatch ? 'Convert All to CSV' : 'Convert to CSV', badge: '.csv', desc: 'Raw Comma-Separated Values' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Apple Printable PDF' }
      ];
    }
    if (mode === 'presentations') {
      return [
        { format: 'pptx', label: isBatch ? 'Convert All to PowerPoint' : 'Convert to PowerPoint', badge: '.pptx', desc: 'Microsoft PowerPoint Presentation' },
        { format: 'pdf', label: isBatch ? 'Convert All to PDF Slides' : 'Convert to PDF Slides', badge: '.pdf', desc: 'Slide Deck PDF Export' }
      ];
    }
    return [
      { format: 'docx', label: isBatch ? 'Convert All to Word' : 'Convert to Word', badge: '.docx', desc: 'Microsoft Word Document' },
      { format: 'pdf', label: isBatch ? 'Convert All to PDF' : 'Convert to PDF', badge: '.pdf', desc: 'Adobe PDF Viewport' }
    ];
  }
};
