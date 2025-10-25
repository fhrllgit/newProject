import { useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import Swal from "sweetalert2";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCLick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/register");
      setLoading(false);
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.post("/users/login", form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
      });
      // alert(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-screen w-full">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>

              <img
                src={logo}
                alt="Loading Logo"
                className="w-12 h-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-screen max-h-screen">
            <div className="flex w-full md:flex-1/2 justify-center">
              <div className="w-full max-w-md md:w-md py-2 flex flex-col px-4 md:px-0">
                <div className="px-2">
                  <div>
                    <img
                      className="w-40 md:w-50 lg:w-70 h-auto object-cover"
                      src="../src/img/logo.png"
                      alt=""
                    />
                  </div>
                  <p className="text-sm font-light tracking-[0.1em] mt-8">
                    START SESION
                  </p>
                  <form className="flex flex-col mt-8" onSubmit={handleSubmit}>
                    <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                      <input
                      type="email"
                        className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                        placeholder="EMAIL"
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-full border-b-[#c3c3c3] border-b mt-9">
                      <input
                        className="outline-0 ring-0 w-full placeholder:text-xs font-extralight placeholder:text-[#939393] mb-1.5"
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col space-y-2.5 mt-10">
                      <div className="border flex-1 pb-0.5">
                        <button
                          className="text-center w-full text-[#fffbfb] cursor-pointer font-extralight tracking-wider bg-black p-2 text-xs -mt-1 h-8 -ml-0.5"
                          type="submit"
                        >
                          LOGIN
                        </button>
                      </div>
                      <div className="border flex-1 pb-0.5">
                        <div
                          onClick={handleCLick}
                          className="text-center flex items-center justify-center w-full text-[#fffbfb] cursor-pointer font-extralight tracking-wider bg-black p-2 text-xs -mt-1 h-8 -ml-0.5"
                        >
                          <span>REGISTER</span>
                        </div>
                      </div>
                    </div>
                  </form>
                  <button className="text-xs font-extralight mt-15 cursor-pointer tracking-widest">
                    BANTUAN
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:flex-1/2">
              <img
                className="w-full object-cover"
                src="../src/img/loginImage.png"
                alt=""
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
