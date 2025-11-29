import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParamsarams();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${path}`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, path]);

  return <div>Loading</div>;
};

export default Loading;
