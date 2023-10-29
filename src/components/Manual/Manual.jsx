import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import LoadingCardSkeleton from "../skeleton/LoadingCardSkeleton";
import { DataGrid } from "@mui/x-data-grid";

const Manual = () => {
  const [error, setError] = useState(false);
  const [recKw, setRecKw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [competitorWebsite, setCompetitorWebsite] = useState("");
  const [yourKeywords, setYourKeywords] = useState("");
  const [country, setCountry] = useState("India");

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const countryList = [
    "Algeria",
    "Angola",
    "Azerbaijan",
    "Argentina",
    "Australia",
    "Austria",
    "Bahrain",
    "Bangladesh",
    "Armenia",
    "Belgium",
    "Bolivia",
    "Brazil",
    "Bulgaria",
    "Myanmar (Burma)",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Sri Lanka",
    "Chile",
    "Taiwan",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Ecuador",
    "El Salvador",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Ghana",
    "Greece",
    "Guatemala",
    "Hong Kong",
    "Hungary",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Kazakhstan",
    "Jordan",
    "Kenya",
    "South Korea",
    "Latvia",
    "Lithuania",
    "Malaysia",
    "Malta",
    "Mexico",
    "Morocco",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Romania",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Vietnam",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sweden",
    "Switzerland",
    "Thailand",
    "United Arab Emirates",
    "Tunisia",
    "Turkey",
    "Ukraine",
    "North Macedonia",
    "Egypt",
    "United Kingdom",
    "United States",
    "Burkina Faso",
    "Uruguay",
    "Venezuela",
  ];

  const generateKw = () => {
    if (loading) return;
    setLoading(true);
    fetchRecommendedKeywords();
  };

  const fetchRecommendedKeywords = async () => {
    try {
      const payload = {
        businessWebsite:
          businessWebsite === null ||
          businessWebsite === undefined ||
          businessWebsite.length === 0
            ? ""
            : businessWebsite,
        competitorWebsite:
          competitorWebsite === null ||
          competitorWebsite === undefined ||
          competitorWebsite.length === 0
            ? ""
            : competitorWebsite,
        yourKeywords:
          yourKeywords === null ||
          yourKeywords === undefined ||
          yourKeywords.length === 0
            ? ""
            : yourKeywords,
        country: country,
      };
      const recommendedKeywords = await getKeywordsRecommendations(
        payload,
        null
      );
      console.log(payload);
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
        "/api/manualKeywords",
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

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <Box
      sx={{
        position: "relative",
        ml: { xs: "0" },
        mt: "2rem",
        width: { xs: "100%" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography
          sx={{
            color: "black",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Recommendations
        </Typography>
      </Box>
      <Divider sx={{ mt: "1rem", mb: "1rem", width: "80%" }} />
      <>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            width: "90%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            sx={{ mt: "1rem" }}
            color="grey"
            fullWidth={false}
            label="Enter business website"
            value={businessWebsite}
            onChange={(event) => setBusinessWebsite(event.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1rem",
                fontWeight: "400",
                color: "grey",
              }}
            >
              Your competitors website link (comma seperated)
            </Typography>
            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={false}
              label="Enter competitor business email"
              value={competitorWebsite}
              multiline={true}
              rows={3}
              onChange={(event) => setCompetitorWebsite(event.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1rem",
                fontWeight: "400",
                color: "grey",
              }}
            >
              Custom keywords (comma seperated)
            </Typography>
            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={false}
              label="Enter your custom keywords"
              variant="outlined"
              value={yourKeywords}
              multiline={true}
              rows={3}
              onChange={(event) => setYourKeywords(event.target.value)}
            />
          </Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              label="Country"
              onChange={handleCountryChange}
            >
              {countryList.map((c) => {
                return (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            m: "3rem",
            display: "flex",
            position: "relative",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={generateKw} variant="contained">
            {loading ? (
              <CircularProgress
                size="1rem"
                variant="indeterminate"
                sx={{ color: "white" }}
              />
            ) : (
              "Generate Keywords"
            )}
          </Button>
        </Box>
      </>
      {!loading && !error && recKw !== null && recKw.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: "80%",
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
            checkboxSelection
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
          />
        </Box>
      )}
      {loading && <LoadingCardSkeleton />}
      {error && <Typography>Something went wrong please try again</Typography>}
    </Box>
  );
};

export default Manual;
