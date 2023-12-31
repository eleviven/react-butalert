import type { ButalertPopupProps } from "./popup.type";

import React, { createContext, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { XMarkIcon } from "../icons";
import { popup } from "./popup.variant";
import { cn, generateCssVariables } from "../../utils/helpers";

export const PopupContext = createContext<ButalertPopupProps>(
  {} as ButalertPopupProps
);

const Popup: React.FC<ButalertPopupProps> = ({
  id,
  isVisible,
  alignment,
  size,
  children,
  showCloseButton,
  colors,
  theme,
  onClose,
}) => {
  const motionValue = useMotionValue(0);
  const motionScale = useTransform(motionValue, [0, 0.8, 1], [0, 1.1, 1]);
  const motionOpacity = useTransform(motionValue, [0, 1], [0, 1]);

  const handleOpen = () => {
    animate(motionValue, 1, {
      duration: 0.25,
    });
  };

  const handleClose = () => {
    animate(motionValue, 0, {
      duration: 0.2,
    }).then(onClose);
  };

  useEffect(() => {
    if (isVisible) handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <PopupContext.Provider
      value={{
        id,
        isVisible,
        alignment,
        size,
        children,
        colors,
        theme,
        onClose: handleClose,
      }}
    >
      <AnimatePresence>
        {/* Popup */}
        <Dialog
          static
          open={isVisible}
          onClose={handleClose}
          className={cn(popup({ size, alignment }))}
          style={generateCssVariables(colors)}
        >
          {/* Backdrop */}
          <motion.div
            className={cn("butalert__backdrop", theme?.backdrop)}
            style={{
              opacity: motionOpacity,
            }}
            aria-hidden="true"
          />

          {/* Panel */}
          <Dialog.Panel
            as={motion.div}
            className={cn("butalert__panel", theme?.panel)}
            style={{
              scale: motionScale,
              opacity: motionOpacity,
            }}
          >
            {/* Close Button */}
            {showCloseButton ? (
              <button
                className={cn("butalert__close-button", theme?.closeButton)}
                aria-label="Close"
                onClick={handleClose}
              >
                <XMarkIcon />
              </button>
            ) : null}

            {/* Entire Content */}
            {children}
          </Dialog.Panel>
        </Dialog>
      </AnimatePresence>
    </PopupContext.Provider>
  );
};

export default Popup;
