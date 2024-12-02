import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  walletAddress: string;
  username: string;
  password: string;
}

export default function LoginPage() {
  const [formValues, setFormValues] = useState<LoginFormValues>({
    walletAddress: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const navigate = useNavigate(); // Hook for navigation

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};

    if (!formValues.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required.";
    } else if (!/^[a-z1234567890A-Z]+/.test(formValues.walletAddress)) {
      newErrors.walletAddress = "Enter a valid wallet address.";
    }

    if (formValues.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (formValues.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Store login data in localStorage
      localStorage.setItem("username", formValues.username);
      localStorage.setItem("walletAddress", formValues.walletAddress);

      // Redirect to the main page
      navigate("/main");
    }
  };

  return (
    <>
    <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Login </h1>
          <hr />
    </div>
    <div className="flex items-center justify-center h-screen px-6">
      <div className="flex-1 flex items-center justify-center bg-[#D73252] px-2 mr-2 h-full rounded">
          <h1 className="text-6xl text-white items-center justify-center font-bold ">Join EMI-Agoric</h1>
      </div>
    
    <div className="flex justify-center items-center min-h-screen bg-gray-100 flex-1">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Safe Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={formValues.walletAddress}
              onChange={handleChange}
              placeholder="0x1234...abcd"
              className="border p-2 w-full rounded"
            />
            {errors.walletAddress && (
              <p className="text-red-500 text-sm">{errors.walletAddress}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="border p-2 w-full rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border p-2 w-full rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
    
    </>
  );
}
