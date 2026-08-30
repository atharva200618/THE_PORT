import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Copy, Check, QrCode, Wifi } from 'lucide-react';
import { getQRCodeImageUrl, generateQRCodeSVG } from '../utils/qrCode';

export default function QRCodeModal({ item, localIp, onClose }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  let downloadUrl = item.downloadUrl?.startsWith('http')
    ? item.downloadUrl
    : `${window.location.origin}${item.downloadUrl}`;

  // If on local development and local LAN IP is available, replace localhost with Wi-Fi IP so phone can reach Mac
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocalhost && localIp && localIp !== 'localhost') {
    downloadUrl = downloadUrl.replace(/localhost(:\d+)?|127\.0\.0\.1(:\d+)?/, `${localIp}:3001`);
  }

  const qrImageUrl = imgError ? generateQRCodeSVG(downloadUrl, 220) : getQRCodeImageUrl(downloadUrl, 240);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm clay-card rounded-3xl p-6 sm:p-7 shadow-2xl text-[#161618] relative text-center space-y-4 border border-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#71717A] hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto border border-blue-500/20 shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#161618] tracking-tight">
            Send to Phone
          </h3>
          <p className="text-xs text-[#71717A]">
            Scan with iPhone or Android camera to download
          </p>
        </div>

        {/* Rendered QR Code Container */}
        <div className="p-3 rounded-2xl bg-white border border-black/5 flex items-center justify-center mx-auto shadow-sm max-w-[210px]">
          <img
            src={qrImageUrl}
            alt="Scan QR code to download converted document"
            className="w-40 h-40 object-contain rounded-lg"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Local Network Wi-Fi Note for dev mode */}
        {isLocalhost && localIp && localIp !== 'localhost' && (
          <div className="p-2 rounded-xl bg-[#F0F0F2] text-[11px] text-[#71717A] flex items-center justify-center gap-1.5 font-medium">
            <Wifi className="w-3 h-3 text-emerald-600" />
            <span>Connect phone to same Wi-Fi ({localIp})</span>
          </div>
        )}

        {/* Document Info */}
        <div className="p-3.5 rounded-2xl bg-white border border-black/5 text-left text-xs space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-[#71717A] uppercase font-bold">
            <span>Document</span>
            <span className="text-emerald-600">Mobile Ready</span>
          </div>
          <p className="text-[#161618] font-bold truncate">
            {item.originalName}
          </p>
          <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-1 border-t border-black/5">
            <span>Target: .{(item.targetFormat || item.targetType || 'pages').toUpperCase()}</span>
            <span className="text-blue-600 font-bold">24-Hour Link</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border active:scale-95 ${
              copied
                ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                : 'bg-white text-[#161618] border-black/5 shadow-sm hover:bg-slate-50'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-full bg-[#1E1E22] text-white text-xs font-bold hover:bg-black transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
