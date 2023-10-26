// ImageSelector.js
import React, { useState } from "react";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  TextField,
} from "@mui/material";

const ImageSelector = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const results = await searchUnsplashImageApi(searchQuery);
        if (results.ok) {
          const resultsJson = await results.json();
          setSearchResults(resultsJson);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelectImage = (image) => {
    onSelect(image);
  };

  const searchUnsplashImageApi = async (query) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/searchPhotos?search=${query}`,
        {
          method: "GET",
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching searchUnsplashImageApi " + err);
    }
    return null;
  };

  return (
    <Box
      sx={{
        m: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: "column",
      }}
    >
      <TextField
        placeholder="Search for images"
        sx={{ mt: "1rem" }}
        color="grey"
        fullWidth={true}
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button sx={{ mt: "1rem" }} onClick={handleSearch} variant="contained">
        Search
      </Button>
      {
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {searchResults.map((item, id) => (
            <ImageListItem key={id} onClick={() => handleSelectImage(item)}>
              <img src={item} alt={"item.title"} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      }
    </Box>
  );
};

export default ImageSelector;
