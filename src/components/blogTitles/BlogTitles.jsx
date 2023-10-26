import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBlogTitlesData,
  getCustomerData,
  storeBlogTitlesData,
} from "../../utils/localStorage";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import LoadingCardSkeleton from "../skeleton/LoadingCardSkeleton";

const BlogTitles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companyData = JSON.parse(getCustomerData());
  const [blogTitles, setBlogTitles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const tmp = getBlogTitlesData();
    if (tmp !== null) {
      setBlogTitles(JSON.parse(tmp));
    } else {
      fetchBlogTitles();
      storeBlogTitlesData(blogTitles);
    }
  }, []);

  const fetchBlogTitles = async () => {
    try {
      setLoading(true);
      console.log("Company data: " + JSON.stringify(companyData));
      const blogTitlesRes = await getBlogTitlesApi(companyData["emailId"]);
      if (
        blogTitlesRes !== null &&
        blogTitlesRes !== undefined &&
        blogTitlesRes.ok
      ) {
        const res = await blogTitlesRes.json();
        setBlogTitles(res);
        console.log("found blogTitlesRes : " + res);
      } else {
        setError(true);
        console.error("Error in fetching blogTitlesRes " + blogTitlesRes);
      }
    } catch (err) {
      setError(true);
      console.error("Error in fetching blogTitlesRes " + err);
    }
    setLoading(false);
  };

  const getBlogTitlesApi = async (email) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/blogTitles?emailId=${email}`,
        {
          method: "GET",
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching getBlogTitlesApi " + err);
    }
    return null;
  };

  const handleWriteBlog = (data) => {
    navigate("/user/write", { state: { blogTitleDetail: data } });
  };

  return (
    <Box
      sx={{
        position: "relative",
        ml: { xs: "0", sm: "240px" },
        mt: "2rem",
        width: { xs: "100%", sm: "calc(100% - 240px)" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{ fontSize: "2rem", fontFamily: "Pacifico", fontWeight: "500" }}
      >
        Blog Titles
      </Typography>
      <Divider sx={{ mt: "1rem", mb: "1rem", width: "80%" }} />
      {loading && !error && <LoadingCardSkeleton />}
      {error && <Typography>Something went wrong please try again</Typography>}
      {!loading && blogTitles !== null && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "80%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {blogTitles.blogTitlesData.map((k) => {
            return (
              <Box
                key={k.title}
                sx={{
                  p: "1rem",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "8px",
                  ":hover": {
                    backgroundColor: "#FAE8E0",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    position: "relative",
                    width: "80%",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontFamily: "Rubik",
                      fontSize: "1.4rem",
                      color: "black",
                    }}
                  >
                    {k.title}
                  </Typography>
                  <Typography>{`Target Keyword: ${k.keywords}`}</Typography>
                  <Typography>{`All Keywords: ${k.allKeywords}`}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    position: "relative",
                    width: "20%",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleWriteBlog(k)}
                  >
                    Write
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default BlogTitles;
