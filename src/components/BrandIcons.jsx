import React from 'react';

/**
 * High-fidelity authentic SVG Brand Icons for Apple iWork & Microsoft Office
 */

export function ApplePagesIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pagesGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF5E3A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#pagesGrad)" />
      {/* Pen / Quill & Paper glyph */}
      <path d="M14 34L20 32L32 16C33.1 14.5 32 13 30.5 13L28.5 14.5L14 34Z" fill="white" fillOpacity="0.95" />
      <path d="M14 34L18 36L14 38L14 34Z" fill="#E05000" />
      <path d="M22 30L34 18M18 34L30 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function MicrosoftWordIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wordGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2B579A" />
          <stop offset="100%" stopColor="#185ABD" />
        </linearGradient>
      </defs>
      {/* Sheet Backdrop */}
      <rect x="14" y="8" width="26" height="32" rx="4" fill="#E8F1FF" />
      <rect x="18" y="14" width="18" height="3" rx="1.5" fill="#185ABD" fillOpacity="0.4" />
      <rect x="18" y="20" width="18" height="3" rx="1.5" fill="#185ABD" fillOpacity="0.4" />
      <rect x="18" y="26" width="12" height="3" rx="1.5" fill="#185ABD" fillOpacity="0.4" />
      {/* 3D Word Tile */}
      <rect x="8" y="12" width="24" height="24" rx="6" fill="url(#wordGrad)" filter="drop-shadow(0 4px 6px rgba(24,90,189,0.35))" />
      <path d="M14 18L16.5 28H18.5L20 22.5L21.5 28H23.5L26 18H24L22.5 25L21 19.5H19L17.5 25L16 18H14Z" fill="white" fontBold="true" />
    </svg>
  );
}

export function AppleKeynoteIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="keynoteGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C7FF" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#keynoteGrad)" />
      {/* Cinema Lectern / Podium & Light */}
      <path d="M15 16L33 16L30 25L18 25L15 16Z" fill="white" fillOpacity="0.95" />
      <rect x="22.5" y="25" width="3" height="9" rx="1.5" fill="white" fillOpacity="0.9" />
      <path d="M18 34L30 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="19" r="2" fill="#007AFF" />
    </svg>
  );
}

export function MicrosoftPowerPointIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pptGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ED6C47" />
          <stop offset="100%" stopColor="#D24726" />
        </linearGradient>
      </defs>
      {/* Slide Sheet Backdrop */}
      <rect x="14" y="8" width="26" height="32" rx="4" fill="#FFF2EE" />
      <circle cx="27" cy="22" r="7" fill="#D24726" fillOpacity="0.25" />
      <path d="M27 15A7 7 0 0 1 34 22L27 22Z" fill="#D24726" fillOpacity="0.6" />
      {/* 3D PowerPoint Tile */}
      <rect x="8" y="12" width="24" height="24" rx="6" fill="url(#pptGrad)" filter="drop-shadow(0 4px 6px rgba(210,71,38,0.35))" />
      <path d="M15 18H20.5C22.4 18 23.5 19.1 23.5 20.8C23.5 22.5 22.4 23.6 20.5 23.6H17.2V28H15V18ZM17.2 21.8H20.2C21.1 21.8 21.6 21.3 21.6 20.8C21.6 20.2 21.1 19.8 20.2 19.8H17.2V21.8Z" fill="white" />
    </svg>
  );
}

export function AppleNumbersIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="numbersGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#30D158" />
          <stop offset="100%" stopColor="#28CD41" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#numbersGrad)" />
      {/* Multi-Bar Charts */}
      <rect x="13" y="24" width="5" height="12" rx="2" fill="white" />
      <rect x="21.5" y="16" width="5" height="20" rx="2" fill="white" />
      <rect x="30" y="20" width="5" height="16" rx="2" fill="white" />
    </svg>
  );
}

export function MicrosoftExcelIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="excelGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#107C41" />
          <stop offset="100%" stopColor="#0B552C" />
        </linearGradient>
      </defs>
      {/* Grid Sheet Backdrop */}
      <rect x="14" y="8" width="26" height="32" rx="4" fill="#E8F8EE" />
      <path d="M20 15H34M20 21H34M20 27H34M20 33H34M26 10V38M32 10V38" stroke="#107C41" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* 3D Excel Tile */}
      <rect x="8" y="12" width="24" height="24" rx="6" fill="url(#excelGrad)" filter="drop-shadow(0 4px 6px rgba(16,124,65,0.35))" />
      <path d="M14.5 18L18.2 23.8L14.2 30H16.6L19.3 25.5L22 30H24.4L20.4 23.8L24.1 18H21.7L19.3 22.1L16.9 18H14.5Z" fill="white" />
    </svg>
  );
}

export function AdobePdfIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pdfGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF3B30" />
          <stop offset="100%" stopColor="#D92117" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#pdfGrad)" />
      {/* Acrobat Ribbon Infinite Loop */}
      <path d="M33.2 27.6C31.5 27.1 27.8 26.6 25.1 27.8C23.6 28.5 21.2 30.1 19.8 33.3C18.2 34.6 16.5 35.4 15.1 35.4C13.2 35.4 12.5 33.8 12.5 32.7C12.5 30.6 15 28.4 19.4 27.2C21.7 23.3 23.4 18.7 24.3 14.8C23.5 13.2 22.7 11.2 22.7 9.8C22.7 8.3 23.6 7.5 24.7 7.5C26 7.5 26.8 8.6 26.8 10.9C26.8 13.9 25.6 18.4 24.4 21.9C27.5 24.2 31.8 25.5 34.7 25.5C36.4 25.5 37.5 26.3 37.5 27.4C37.5 28.8 35.6 28.3 33.2 27.6ZM15.4 33.3C16.3 33.3 17.5 32.5 18.8 31C16 31.8 14.7 32.6 14.7 33.1C14.7 33.2 15 33.3 15.4 33.3ZM24.7 9.6C24.4 9.6 24.2 9.8 24.2 10.4C24.2 11.6 24.8 13.5 25.3 14.8C25.5 12.8 25.5 11 25.5 10.4C25.5 9.8 25.1 9.6 24.7 9.6ZM22.4 26C23.8 23.4 24.8 20.3 25.3 17.7C24.4 20.8 23 24.5 21.3 27.6C21.7 27 22.1 26.5 22.4 26ZM33.8 26.8C32 26.8 29.5 26.1 27.4 24.7C29.2 25.4 31.7 25.9 33.2 26.3C33.9 26.5 34.4 26.7 34.6 26.8C34.4 26.8 34.1 26.8 33.8 26.8Z" fill="white" />
    </svg>
  );
}

/**
 * Geometric, futuristic, ultra-clean wordmark for THE PORT
 * Matches the exact aesthetic weight of the AVERO logo
 */
export function ThePortLogo({ className = "h-4 sm:h-5 w-auto" }) {
  return (
    <svg className={className} viewBox="0 0 118 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Geometric Modern Wordmark: PORT */}
      {/* P */}
      <path d="M3 21V3H13C17.4 3 20.5 5.8 20.5 10C20.5 14.2 17.4 17 13 17H7.5V21H3ZM7.5 12.5H12.5C14.5 12.5 16 11.4 16 10C16 8.6 14.5 7.5 12.5 7.5H7.5V12.5Z" fill="#111113" />
      {/* O */}
      <path d="M43 3C49.6 3 55 8.2 55 12C55 15.8 49.6 21 43 21C36.4 21 31 15.8 31 12C31 8.2 36.4 3 43 3ZM43 7.5C39 7.5 35.8 9.5 35.8 12C35.8 14.5 39 16.5 43 16.5C47 16.5 50.2 14.5 50.2 12C50.2 9.5 47 7.5 43 7.5Z" fill="#111113" />
      {/* R */}
      <path d="M65 21V3H75C79.4 3 82.5 5.8 82.5 10C82.5 13 80.8 15.2 78 16.2L83.5 21H78L73.2 16.5H69.5V21H65ZM69.5 12.5H74.5C76.5 12.5 78 11.4 78 10C78 8.6 76.5 7.5 74.5 7.5H69.5V12.5Z" fill="#111113" />
      {/* T */}
      <path d="M92 7.2V3H115V7.2H106V21H101V7.2H92Z" fill="#111113" />
    </svg>
  );
}
