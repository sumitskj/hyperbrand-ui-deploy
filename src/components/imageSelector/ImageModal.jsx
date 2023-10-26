// ImageModal.js
import { Dialog, DialogTitle } from "@mui/material";
import React from "react";

const ImageModal = ({ isOpen, onRequestClose, children }) => {
  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "600",
          fontFamily: "Pacifico",
        }}
      >
        Select Image
      </DialogTitle>
      {children}
    </Dialog>
  );
};

export default ImageModal;
