import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCustomerData } from "../../utils/localStorage";
import { fetchBackendApiWrapper } from "../../utils/apiWrapper";
import LoadingCardSkeleton from "../skeleton/LoadingCardSkeleton";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./WriteBlog.css";
import ImageSelector from "../imageSelector/ImageSelector";
import ImageModal from "../imageSelector/ImageModal";
import { useDispatch } from "react-redux";
import { openNotification } from "../notifications/slice/notification";

const WriteBlog = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const companyData = JSON.parse(getCustomerData());
  const [initLoading, setInitLoading] = useState(false);
  const [initError, setInitError] = useState(false);
  const [blog, setBlog] = useState("");
  const [audience, setAudience] = useState("Everyone");
  const [addCompanyInfo, setAddCompanyInfo] = useState(false);
  const [otherInfo, setOtherInfo] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState(false);
  const [imageAltText, setImageAltText] = useState("Make up image");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const quill = useRef();

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setInitLoading(true);
      const payload = {
        emailId: companyData.emailId,
        title: state.blogTitleDetail.title,
      };
      const blogDataRes = await getBlogDataApi(payload);
      if (blogDataRes !== null && blogDataRes !== undefined && blogDataRes.ok) {
        const res = await blogDataRes.json();
        setBlog(res.blog);
        setAudience(res.audience);
        setOtherInfo(res.otherInfo);
        setAddCompanyInfo(res.includeCompanyDesc);
        setMetaDesc(res.meta);
        console.log("found blogDataRes : " + res);
      } else {
        console.error("No blog already written found " + blogDataRes);
      }
    } catch (err) {
      console.error("Error in fetching blogDataRes " + err);
    }
    setInitLoading(false);
  };

  const getBlogDataApi = async (payload) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/fetchBlog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching getBlogDataApi " + err);
    }
    return null;
  };

  const generateBlog = () => {
    if (blogLoading) return;
    fetchGenerateBlogData();
  };

  const fetchGenerateBlogData = async () => {
    try {
      setBlogLoading(true);
      const payload = {
        emailId: companyData.emailId,
        title: state.blogTitleDetail.title,
        targetKeyword: state.blogTitleDetail.keywords,
        keywords: state.blogTitleDetail.allKeywords,
        audience: audience,
        companyDescription: addCompanyInfo ? companyData.companyDetails : "",
        otherInfo: otherInfo,
      };
      const genBlogRes = await getGenerateBlogApi(payload);
      if (genBlogRes !== null && genBlogRes !== undefined && genBlogRes.ok) {
        const res = await genBlogRes.json();
        setBlog(res.blog);
        setBlogError(false);
        console.log("found genBlogRes : " + res);
      } else {
        setBlogError(true);
        console.error("Error in genBlogRes " + genBlogRes);
      }
    } catch (err) {
      setBlogError(true);
      console.error("Error in fetching genBlogRes " + err);
    }
    setBlogLoading(false);
  };

  const getGenerateBlogApi = async (payload) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/generateBlog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching getBlogDataApi " + err);
    }
    return null;
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const saveBtn = async () => {
    // var range = quill.current.getEditor().getSelection();
    // console.log(quill.current.getEditor().getText(range.index, range.length));
    // quill.current.getEditor().deleteText(range.index, range.length);
    // quill.current.getEditor().insertText(range.index, "Sumit");
    // console.log(quill.current.getEditor().root.innerHTML);
    const payload = {
      title: state.blogTitleDetail.title,
      emailId: companyData.emailId,
      blog: blog,
    };
    try {
      const updateBlogRes = await updateBlogApi(payload);
      if (updateBlogRes.ok) {
        dispatch(
          openNotification({
            severity: "success",
            message: "Blog updated successfully",
          })
        );
      }
    } catch (err) {
      console.log("Error in updating blog : " + err);
      dispatch(
        openNotification({
          severity: "error",
          message: "Error in updating Blog",
        })
      );
    }
  };

  const copyHTMLBtn = () => {
    navigator.clipboard.writeText(blog);
    dispatch(
      openNotification({
        severity: "success",
        message: "Blog copied to clipboard",
      })
    );
  };

  const updateBlogApi = async (payload) => {
    try {
      const response = await fetchBackendApiWrapper(
        `/api/saveBlog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        null
      );
      return response;
    } catch (err) {
      console.error("Error in fetching saveBlog " + err);
    }
    return null;
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleImageSelect = (image) => {
    setSelectedImages((old) => [...old, image]);
    handleCloseModal();
  };

  useEffect(() => {
    if (selectedImages.length > 0) {
      const ind = blog.indexOf("<h2>");
      const tmp = [
        blog.slice(0, ind),
        `<img src=${
          selectedImages[selectedImages.length - 1]
        } alt=${imageAltText} height='200px' /><br />`,
        blog.slice(ind),
      ].join("");
      setBlog(tmp);
    }
  }, [selectedImages]);

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
      {!initLoading && !initError && (
        <>
          <Box
            sx={{
              display: "flex",
              position: "relative",
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontFamily: "Inter",
                fontSize: "1.4rem",
                color: "black",
              }}
            >
              {state.blogTitleDetail.title}
            </Typography>
            <Typography>{`Target Keyword: ${state.blogTitleDetail.keywords}`}</Typography>
            <Typography>{`All Keywords: ${state.blogTitleDetail.allKeywords}`}</Typography>
          </Box>
          <Box
            sx={{
              mt: "2rem",
              display: "flex",
              position: "relative",
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <FormGroup>
                <FormControlLabel
                  required
                  control={<Checkbox />}
                  value={addCompanyInfo}
                  onChange={(event) => setAddCompanyInfo(event.target.checked)}
                  label="Add Company Information in Blog"
                />
              </FormGroup>
            </Box>
            <Box>
              <TextField
                sx={{ mt: "1rem" }}
                color="grey"
                fullWidth={true}
                variant="outlined"
                label="Audience"
                value={audience}
                onChange={(event) => {
                  setAudience(event.target.value);
                }}
              />
            </Box>
            <Box>
              <TextField
                sx={{ mt: "1rem" }}
                color="grey"
                multiline={true}
                rows={4}
                label="Any points you want to add in your blog"
                fullWidth={true}
                variant="outlined"
                value={otherInfo}
                onChange={(event) => setOtherInfo(event.target.value)}
              />
            </Box>
          </Box>
          <Box>
            <Button variant="contained" color="success" onClick={generateBlog}>
              {blogLoading ? (
                <CircularProgress
                  size="1rem"
                  variant="indeterminate"
                  sx={{ color: "white" }}
                />
              ) : (
                "Generate Blog"
              )}
            </Button>
          </Box>
          <Divider sx={{ mt: "1rem", mb: "1rem", width: "80%" }} />
        </>
      )}
      {blogLoading && !blogError && <LoadingCardSkeleton />}
      {!blogLoading && !blogError && (
        <Box
          sx={{
            mt: "1px",
            display: "flex",
            position: "relative",
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              mt: "1px",
              display: "flex",
              position: "relative",
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              mb: "1rem",
            }}
          >
            <Button variant="contained" onClick={saveBtn}>
              Save Blog
            </Button>
            <Button variant="contained" color="info" onClick={copyHTMLBtn}>
              Copy HTML Blog
            </Button>
            <Button
              onClick={handleOpenModal}
              variant="contained"
              color="secondary"
            >
              Select images
            </Button>
            {/* {blog !== null && blog.length > 0 && (
              <Button
                onClick={handleOpenModal}
                variant="contained"
                color="warning"
              >
                Generate Promotional Content
              </Button>
            )} */}
          </Box>
          <Box>
            <ImageModal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
              <ImageSelector onSelect={handleImageSelect} />
            </ImageModal>
          </Box>
          <Grid
            container
            direction={"row"}
            justifyContent={"space-evenly"}
            alignItems={"flex-start"}
            mb={"1rem"}
          >
            <Grid item xs={10}>
              <ReactQuill
                ref={quill}
                value={blog}
                onChange={setBlog}
                modules={modules}
                formats={formats}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              backgroundColor: "#FAE8E0",
              m: "1rem",
              borderRadius: "1rem",
              p: "1rem",
            }}
          >
            <Typography>{metaDesc}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#FAE8E0",
              m: "1rem",
              borderRadius: "1rem",
              p: "1rem",
            }}
          >
            <Typography>{`Image Alt Text: ${imageAltText}`}</Typography>
          </Box>
        </Box>
      )}
      {blogError && "Something went wrong"}
    </Box>
  );
};

export default WriteBlog;
