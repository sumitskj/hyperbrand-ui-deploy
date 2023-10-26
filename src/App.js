import { Provider } from "react-redux";
import "./App.css";
import CompanyOnboardForm from "./components/companyOnboardForm/CompanyOnboardForm";
import store from "./redux/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Notification from "./components/notifications";
import Home from "./components/home/Home";
import SideBar from "./components/sideBar/SideBar";
import BlogTitles from "./components/blogTitles/BlogTitles";
import WriteBlog from "./components/writeBlog/WriteBlog";
import MyBlogs from "./components/myBlogs/MyBlogs";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CompanyOnboardForm />,
    },
    {
      path: "/user",
      element: <SideBar />,
      children: [
        {
          path: "/user/home",
          element: <Home />,
        },
        {
          path: "/user/keywords",
          element: <Home />,
        },
        {
          path: "/user/my-titles",
          element: <BlogTitles />,
        },
        {
          path: "/user/write",
          element: <WriteBlog />,
        },
        {
          path: "/user/my-blogs",
          element: <MyBlogs />,
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <Notification />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
