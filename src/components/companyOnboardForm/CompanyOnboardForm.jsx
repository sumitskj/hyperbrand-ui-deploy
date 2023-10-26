import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openNotification } from "../notifications/slice/notification";
import { getCustomerData, storeCompanyData } from "../../utils/localStorage";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import { useNavigate } from "react-router-dom";

const CompanyOnboardForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [competitionWebsiteLinks, setCompetitionWebsiteLinks] = useState("");
  const [services, setServices] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");

  useEffect(() => {
    const data = getCustomerData();
    console.log("Data: " + JSON.stringify(data));
    if (data !== null && data !== undefined) {
      navigate("/user/home", { replace: "true" });
    }
  }, []);

  const submitCompanyDetails = async () => {
    if (companyName.length === 0 || emailId.length === 0) {
      dispatch(
        openNotification({
          severity: "error",
          message: "Fill all required details.",
        })
      );
      return;
    }
    try {
      const payload = {
        name: companyName,
        emailId: emailId,
        industry: industry,
        country: country,
        websiteLink: websiteLink,
        competitionWebsiteLinks: competitionWebsiteLinks,
        services: services,
        companyDetails: companyDetails,
      };
      const postComapanyDetailsRes = await postComapnyDetails(payload, null);
      if (postComapanyDetailsRes.ok) {
        storeCompanyData(payload);
        navigate("/user/home", { replace: "true" });
        dispatch(
          openNotification({
            severity: "success",
            message: "Comapny onboarded successfully",
          })
        );
      }
    } catch (err) {
      console.log("Error in saving company details : " + err);
      dispatch(
        openNotification({
          severity: "error",
          message: "Something went wrong. Please try again.",
        })
      );
    }
  };

  const postComapnyDetails = async (payload, token) => {
    const response = await fetchBackendApiWrapper(
      "/api/onboardCustomer",
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
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          width: "100%",
          mt: "4rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Pacifico",
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
            Please fill company details
          </Typography>
          <hr />
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Company Name
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              error={companyName.length === 0 ? true : false}
              variant="outlined"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Email Id
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={emailId}
              error={emailId.length === 0 ? true : false}
              onChange={(event) => setEmailId(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Industry
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Tell us about what your company do in few words
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              multiline={true}
              rows={4}
              fullWidth={true}
              variant="outlined"
              value={companyDetails}
              onChange={(event) => setCompanyDetails(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Country
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              List of services you offer (Comma seperated)
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={services}
              onChange={(event) => setServices(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Your Website Link
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={websiteLink}
              onChange={(event) => setWebsiteLink(event.target.value)}
            />
          </Box>
          <Box sx={{ mt: "2rem", mb: "2rem" }}>
            <Typography
              sx={{
                fontFamily: "Rubik",
                fontSize: "1.2rem",
                fontWeight: "400",
              }}
            >
              Your competitors website link (comma seperated)
            </Typography>

            <TextField
              sx={{ mt: "1rem" }}
              color="grey"
              fullWidth={true}
              variant="outlined"
              value={competitionWebsiteLinks}
              onChange={(event) =>
                setCompetitionWebsiteLinks(event.target.value)
              }
            />
          </Box>
          <Button
            sx={{
              mt: "1rem",
              mb: "2rem",
              display: "flex",
              position: "relative",
              width: "100%",
              backgroundColor: "black",
              color: "white",
              fontWeight: "400",
              ":hover": { fontWeight: "800", backgroundColor: "black" },
            }}
            variant="contained"
            onClick={submitCompanyDetails}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CompanyOnboardForm;
