import React from "react";
import PropTypes from "prop-types";
import { Box, Skeleton } from "@mui/material";

const LoadingCardSkeleton = ({ width }) => {
  return (
    <Box sx={{ width: width, margin: "2rem", my: 5, display: "inline-block" }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={250}
        sx={{ borderRadius: "1rem" }}
      />
      <Box sx={{ pt: 1 }}>
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
      <Box sx={{ mt: "1rem", display: "flex", justifyContent: "center" }}>
        {"Loading Please wait ..."}
      </Box>
    </Box>
  );
};

LoadingCardSkeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

LoadingCardSkeleton.defaultProps = {
  width: 350,
};

export default LoadingCardSkeleton;
