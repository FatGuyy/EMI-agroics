import { useState, useEffect } from "react";

const HomeComponent = () => {
    // State for user balance and EMI details
    const [user, setUser] = useState({ name: "John Doe", balance: 5000, emi: 1000 });
    const [message, setMessage] = useState("");

    // Function to deduct EMI
    const deductEMI = () => {
        if (user.balance >= user.emi) {
            setUser({
                name: user.name,
                balance: user.balance - user.emi,
                emi: user.emi,
            });
            setMessage(`EMI of ${user.emi} deducted. Remaining balance: ${user.balance - user.emi}`);
        } else {
            setMessage("Insufficient balance. Please add funds to your account.");
        }
    };

    // Simulate EMI deduction every 30 seconds (to mimic monthly schedule)
    useEffect(() => {
        const interval = setInterval(() => {
            deductEMI();
        }, 30000); // Adjust for real monthly interval in production

        return () => clearInterval(interval);
    }, [user]);

    // Handle manual EMI trigger for testing
    const handleDeductEMI = () => {
        deductEMI();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">EMI Payment App</h1>
                <p className="text-lg mb-2">
                    <strong>Name:</strong> {user.name}
                </p>
                <p className="text-lg mb-2">
                    <strong>Account Balance:</strong> ${user.balance}
                </p>
                <p className="text-lg mb-4">
                    <strong>EMI Amount:</strong> ${user.emi}
                </p>
                <button
                    onClick={handleDeductEMI}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    Deduct EMI
                </button>
                <p
                    className={`mt-4 text-center text-lg ${message.includes("Insufficient") ? "text-red-500" : "text-green-500"}`}
                >
                    {message}
                </p>
            </div>
        </div>
    );
};

export default HomeComponent;
