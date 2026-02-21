"use client";

import React, { SVGProps, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyBannerProps {
  isVisible: boolean;
  onClose: () => void;
  onVisibilityChange?: (visible: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export function StickyBanner({
  className,
  children,
  isVisible,
  onClose,
  onVisibilityChange,
}: StickyBannerProps) {
  const [bannerVisible, setBannerVisible] = useState(isVisible);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const { scrollY } = useScroll();

  /* ============================
      Manual Close
  ============================ */
  const handleClose = () => {
    setIsManuallyClosed(true);
    setBannerVisible(false);
    onClose();
    onVisibilityChange?.(false);
  };

  /* ============================
      Scroll Behavior
  ============================ */
  useMotionValueEvent(scrollY, "change", (current) => {
    if (isManuallyClosed || !isVisible) return;

    const scrollingDown = current > lastScrollY;
    const scrollingUp = current < lastScrollY;
    const threshold = 100;

    if (scrollingDown && current > threshold) {
      setBannerVisible(false);
      onVisibilityChange?.(false);
    }

    if (scrollingUp || current <= threshold) {
      setBannerVisible(true);
      onVisibilityChange?.(true);
    }

    setLastScrollY(current);
  });

  /* ============================
      Sync from Parent
  ============================ */
  useEffect(() => {
    if (!isManuallyClosed) {
      setBannerVisible(isVisible);
      onVisibilityChange?.(isVisible);
    }
  }, [isVisible, isManuallyClosed, onVisibilityChange]);

  /* ============================
      Render
  ============================ */
  return (
    <motion.div
      className={cn(
        "relative z-40 flex min-h-6 w-full items-center justify-center px-4 py-1",
        className
      )}
      initial={{ x: -1000, opacity: 0 }}
      animate={{
        x: bannerVisible ? 0 : -1000,
        opacity: bannerVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
    >
      {/* Content */}
      {children}

      {/* Close Button */}
      <motion.button
        initial={{scale: 0, opacity: 0 }}
        animate={{
          scale: bannerVisible ? 1 : 0,
          opacity: bannerVisible ? 1 : 0,
        }}
        transition={{
          delay: 0.15,
          duration: 0.2,
        }}
        onClick={handleClose}
        aria-label="Close banner"
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:scale-110 hover:bg-white/10 transition"
      >
        <CloseIcon className="h-4 w-4 text-white" />
      </motion.button>
    </motion.div>
  );
}

/* ============================
    Close Icon
============================ */

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
