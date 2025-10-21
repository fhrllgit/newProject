import { useNavigate } from "react-router-dom";
import ProductSection from "../../../hooks/useProduct";

export default function Section() {
  const navigate = useNavigate();

  return (
    <>
      <ProductSection
        title="New And Best Product from our store"
        endpoint="/products/product"     // useFetch akan memanggil api baseURL + endpoint
        limit={6}
        onItemClick={(item) => navigate(`/product/${item.id}`, { state: item })}
        showLike={true}
      />
    </>
  );
}