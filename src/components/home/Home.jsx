import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import {
  getCustomerData,
  getRecKeywordsData,
  storeBlogTitlesData,
} from "../../utils/localStorage";
import LoadingCardSkeleton from "../skeleton/LoadingCardSkeleton";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openNotification } from "../notifications/slice/notification";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 0 -> Recommendations 1 -> Search your keyword
  const [currentView, setCurrentView] = useState(null);
  const [error, setError] = useState(false);
  const [recKw, setRecKw] = useState(null);
  const [loading, setLoading] = useState(false);
  const companyData = JSON.parse(getCustomerData());
  const [selectedKw, setSelectedKw] = useState([]);
  const [openSubmitKwDialog, setOpenSubmitKwDialog] = useState(false);

  const changeView = (view) => {
    setCurrentView(view);
  };

  const submitKeywords = () => {
    if (selectedKw.length > 0) {
      setOpenSubmitKwDialog(true);
    }
  };

  const SubmitKwDialog = () => {
    const [targetKw, setTargetKw] = useState(null);
    const [loading, setLoading] = useState(null);
    const handleSubmitKwDialogClose = (event, reason) => {
      if (loading) {
        return;
      }
      setOpenSubmitKwDialog(false);
    };

    const handleTargetKwSelect = (event) => {
      setTargetKw(event.target.value);
      console.log("Target Kw : " + targetKw);
    };

    const generateTitle = async () => {
      if (loading) return;
      setLoading(true);
      // generate titles api
      const payload = {
        emailId: companyData["emailId"],
        targetKeyword: targetKw,
        keywords: selectedKw.map((k) => k.keyword),
      };
      const aiTitlesRes = await getBlogTitles(payload, null);
      if (aiTitlesRes !== null && aiTitlesRes !== undefined && aiTitlesRes.ok) {
        const aiTitles = await aiTitlesRes.json();
        storeBlogTitlesData(aiTitles);
        setLoading(false);
        navigate("/user/my-titles", { replace: "true" });
        dispatch(
          openNotification({
            severity: "success",
            message: "Blog Titles generated.",
          })
        );
      } else {
        setLoading(false);
        dispatch(
          openNotification({
            severity: "error",
            message: "Error in generating Blog Titles. Please try again.",
          })
        );
      }
    };

    const getBlogTitles = async (payload, token) => {
      console.log("payload generate titles: " + JSON.stringify(payload));
      try {
        const response = await fetchBackendApiWrapper(
          "/api/generateTitles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
          token
        );
        return response;
      } catch (err) {
        console.error("Error in fetching generateTitles " + err);
      }
      return null;
    };

    return (
      <Dialog open={openSubmitKwDialog} onClose={handleSubmitKwDialogClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "600",
            fontFamily: "Pacifico",
          }}
        >
          Submit Keywords
        </DialogTitle>
        <Box
          sx={{
            m: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography>
              <span style={{ fontWeight: "600" }}>Selected Keywords:</span>{" "}
              {selectedKw.map((k) => k.keyword + ",")}
            </Typography>
            <FormControl
              sx={{
                mt: "1rem",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <InputLabel id="demo-simple-select-autowidth-label">
                Primary Keyword
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={targetKw}
                onChange={handleTargetKwSelect}
                autoWidth
                label="Primary Keyword"
              >
                {selectedKw.map((k) => {
                  return <MenuItem value={k.keyword}>{k.keyword}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                sx={{
                  mt: "1rem",
                  backgroundColor:
                    targetKw !== null && targetKw !== undefined
                      ? "#EF7C8E"
                      : "grey",
                  color: "white",
                  ":hover": {
                    backgroundColor:
                      targetKw !== null && targetKw !== undefined
                        ? "#EF7C8E"
                        : "grey",
                    fontWeight: "600",
                  },
                }}
                onClick={generateTitle}
              >
                {loading ? (
                  <CircularProgress
                    size="1rem"
                    variant="indeterminate"
                    sx={{ color: "white" }}
                  />
                ) : (
                  "Submit and generate Blog Titles"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    );
  };

  useEffect(() => {
    setCurrentView(0);
  }, []);

  useEffect(() => {
    if (currentView === 0) {
      setLoading(true);
      const tmp = getRecKeywordsData();
      if (tmp !== null) {
        setRecKw(JSON.parse(tmp));
      } else {
        fetchRecommendedKeywords();
      }
    }
  }, [currentView]);

  const fetchRecommendedKeywords = async () => {
    try {
      console.log("Company data: " + JSON.stringify(companyData));
      const payload = {
        email: companyData["emailId"],
        businessWebsite: companyData["websiteLink"],
        competitorWebsite: companyData["competitionWebsiteLinks"],
        services: companyData["services"],
      };
      const recommendedKeywords = await getKeywordsRecommendations(
        payload,
        null
      );
      if (
        recommendedKeywords !== null &&
        recommendedKeywords !== undefined &&
        recommendedKeywords.ok
      ) {
        const res = await recommendedKeywords.json();
        setRecKw(res);
        console.log("found recommended kw : " + res);
      } else {
        setError(true);
        console.error(
          "Error in fetching recommended kw " + recommendedKeywords
        );
      }
    } catch (err) {
      setError(true);
      console.error("Error in fetching recommended kw " + err);
    }
    setLoading(false);
  };

  const getKeywordsRecommendations = async (payload, token) => {
    console.log("payload: " + JSON.stringify(payload));
    try {
      const response = await fetchBackendApiWrapper(
        "/api/optimalKeywords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        token
      );
      return response;
    } catch (err) {
      console.error("Error in fetching recommended kw " + err);
    }
    return null;
  };

  const columns = [
    {
      field: "keyword",
      headerName: "Keyword",
      width: 400,
    },
    {
      field: "monthlySearchVolume",
      headerName: "Monthly Search Volume",
      width: 200,
    },
    {
      field: "keywordDifficulty",
      headerName: "Keyword Difficulty",
      width: 200,
    },
  ];

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
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          sx={{
            mt: "1rem",
            mb: "2rem",
            display: "flex",
            position: "relative",
            width: "100%",
            backgroundColor: "white",
            border: currentView === 0 ? "1px solid black" : "0px",
            color: currentView === 0 ? "black" : "grey",
            fontWeight: currentView === 0 ? "600" : "400",
            ":hover": { fontWeight: "800", backgroundColor: "white" },
          }}
          onClick={() => changeView(0)}
          variant="contained"
        >
          Recommendations
        </Button>
        <Box sx={{ width: "10rem" }}></Box>
        <Button
          sx={{
            mt: "1rem",
            mb: "2rem",
            display: "flex",
            position: "relative",
            width: "100%",
            backgroundColor: "white",
            border: currentView === 1 ? "1px solid black" : "0px",
            color: currentView === 1 ? "black" : "grey",
            fontWeight: currentView === 1 ? "600" : "400",
            ":hover": { fontWeight: "800", backgroundColor: "white" },
          }}
          variant="contained"
          onClick={() => changeView(1)}
        >
          Custom Search Keywords
        </Button>
      </Box>
      <Divider sx={{ mt: "1rem", mb: "1rem", width: "80%" }} />
      <Box>
        {loading && <LoadingCardSkeleton />}
        {error && (
          <Typography>Something went wrong please try again</Typography>
        )}
        {!loading && recKw !== null && !error && currentView === 0 && (
          <>
            {selectedKw.length !== 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Button
                  sx={{
                    mt: "1rem",
                    mb: "2rem",

                    backgroundColor: "green",
                    color: "white",
                    fontWeight: "400",
                    ":hover": { fontWeight: "800", backgroundColor: "green" },
                  }}
                  variant="contained"
                  onClick={submitKeywords}
                >
                  Search Titles
                </Button>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "stretch",
                position: "relative",
                width: "100%",
              }}
            >
              <DataGrid
                rows={recKw.map((r, id) => {
                  return {
                    id: id,
                    keyword: r.keyword,
                    monthlySearchVolume: r.monthlySearchVolume,
                    keywordDifficulty: r.keywordDifficulty,
                  };
                })}
                columns={columns}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#EF7C8E",
                    color: "white",
                    fontWeight: "800",
                    fontFamily: "Rubik",
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 20 },
                  },
                }}
                pageSizeOptions={[20, 40]}
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = recKw
                    .map((r, id) => {
                      return {
                        id: id,
                        keyword: r.keyword,
                        monthlySearchVolume: r.monthlySearchVolume,
                        keywordDifficulty: r.keywordDifficulty,
                      };
                    })
                    .filter((row) => selectedIDs.has(row.id));
                  setSelectedKw(selectedRows);
                }}
              />
            </Box>
            <SubmitKwDialog />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;
