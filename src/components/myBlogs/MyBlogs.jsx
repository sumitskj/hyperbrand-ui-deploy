import { useEffect, useState } from "react";
import { getCustomerData } from "../../utils/localStorage";
import { Box, Button, Divider, Typography } from "@mui/material";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import { useNavigate } from "react-router-dom";
import LoadingCardSkeleton from "../skeleton/LoadingCardSkeleton";

const MyBlogs = () => {
  const navigate = useNavigate();
  const companyData = JSON.parse(getCustomerData());
  const [myBlogs, setMyBlogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const myBlogRes = await getMyBlogApi(companyData["emailId"]);
      if (myBlogRes !== null && myBlogRes !== undefined && myBlogRes.ok) {
        const res = await myBlogRes.json();
        setMyBlogs(res);
        console.log("found myBlogRes : " + res);
      } else {
        setError(true);
        console.error("Error in fetching myBlogRes " + myBlogRes);
      }
    } catch (err) {
      setError(true);
      console.error("Error in fetching myBlogRes " + err);
    }
    setLoading(false);
  };

  const getMyBlogApi = async (email) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/fetchBlog?emailId=${email}`,
        {
          method: "GET",
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching getMyBlogApi " + err);
    }
    return null;
  };

  const handleOpenBlog = (data) => {
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
        My Blogs
      </Typography>
      <Divider sx={{ mt: "1rem", mb: "1rem", width: "80%" }} />
      {loading && !error && <LoadingCardSkeleton />}
      {error && <Typography>Something went wrong please try again</Typography>}
      {!loading && myBlogs !== null && (
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
          {myBlogs.map((k) => {
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
                  <Typography>{`Target Keyword: ${k.targetKeyword}`}</Typography>
                  <Typography>{`All Keywords: ${k.keywords}`}</Typography>
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
                    onClick={() =>
                      handleOpenBlog({
                        title: k.title,
                        keywords: k.targetKeyword,
                        allKeywords: k.keywords,
                      })
                    }
                  >
                    Open
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

export default MyBlogs;
