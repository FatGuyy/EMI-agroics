import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface FormValues {
  username: string;
  password: string;
  preferenceCurrency1: string;
  preferenceCurrency2: string;
  preferenceCurrency3: string;
  userAddress: string;
  lenderAddress: string;
  emiPaymentDay: string;
}

const currencies = ["USD", "BLD", "IST"];

export function LoanApplicationForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    password: "",
    preferenceCurrency1: "",
    preferenceCurrency2: "",
    preferenceCurrency3: "",
    userAddress: "",
    lenderAddress: "",
    emiPaymentDay: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const navigate = useNavigate(); // Initialize the navigate function

  const validateForm = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    if (formValues.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
    if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formValues.preferenceCurrency1) {
      newErrors.preferenceCurrency1 = "Please select a currency.";
    }
    if (!formValues.preferenceCurrency2) {
      newErrors.preferenceCurrency2 = "Please select a currency.";
    }
    if (!formValues.preferenceCurrency3) {
      newErrors.preferenceCurrency3 = "Please select a currency.";
    }
    if (!formValues.userAddress.trim()) {
      newErrors.userAddress = "Please enter your address.";
    }
    if (!formValues.lenderAddress.trim()) {
      newErrors.lenderAddress = "Please enter the lender's address.";
    }
    if (!formValues.emiPaymentDay) {
      newErrors.emiPaymentDay = "Please select a payment day.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Function to submit data using axios
  const submitData = async () => {
    const data = {
      username: formValues.username,
      password: formValues.password,
      preference_currency_1: formValues.preferenceCurrency1,
      preference_currency_2: formValues.preferenceCurrency2,
      preference_currency_3: formValues.preferenceCurrency3,
      your_address: formValues.userAddress,
      lenders_address: formValues.lenderAddress,
      emi_payment_day: parseInt(formValues.emiPaymentDay, 10), // Convert to number
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/submit", data);
      console.log(response.data);
      alert("Form submitted successfully.");
      navigate("/login"); // Redirect to login page after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      submitData();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex-1 flex items-center justify-center bg-[#D73252] p-2 mr-2 h-full rounded">
          <h1 className="text-6xl text-white items-center justify-center font-bold">Join EMI-Agoric</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 pl-4">
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="border p-2 w-full"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border p-2 w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <label>Preference Currency {num}</label>
              <select
                name={`preferenceCurrency${num}`}
                value={(formValues as any)[`preferenceCurrency${num}`]} // TypeScript workaround for dynamic key
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">Select preferred currency</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              {errors[`preferenceCurrency${num}` as keyof FormValues] && (
                <p className="text-red-500">
                  {errors[`preferenceCurrency${num}` as keyof FormValues]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label>Your Address</label>
            <input
              type="text"
              name="userAddress"
              value={formValues.userAddress}
              onChange={handleChange}
              placeholder="Enter your address"
              className="border p-2 w-full"
            />
            {errors.userAddress && <p className="text-red-500">{errors.userAddress}</p>}
          </div>
          <div>
            <label>Lender's Address</label>
            <input
              type="text"
              name="lenderAddress"
              value={formValues.lenderAddress}
              onChange={handleChange}
              placeholder="Enter lender's address"
              className="border p-2 w-full"
            />
            {errors.lenderAddress && <p className="text-red-500">{errors.lenderAddress}</p>}
          </div>
          <div>
            <label>EMI Payment Day</label>
            <select
              name="emiPaymentDay"
              value={formValues.emiPaymentDay}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">Select EMI payment day</option>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day.toString()}>
                  {day}
                </option>
              ))}
            </select>
            {errors.emiPaymentDay && <p className="text-red-500">{errors.emiPaymentDay}</p>}
          </div>
          <button type="submit" className="bg-[#391479] text-white p-2 rounded w-full">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign UP</h1>
      <hr />
      <LoanApplicationForm />
    </main>
  );
}
