import { useNavigate } from "react-router";

export const useGoBack = (fallbackPath: string = "/dashboard") => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return goBack;
};
