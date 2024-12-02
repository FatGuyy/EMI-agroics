import { useEffect, useState } from "react";

// Helper function to calculate next EMI date
const calculateNextEmiDate = (emiPaymentDay: number) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // Get the current month (0-indexed)
  const currentYear = today.getFullYear();

  // Set the date for the next EMI payment
  let nextEmiDate = new Date(currentYear, currentMonth, emiPaymentDay);

  // If the EMI day is before today's date, the next EMI will be in the next month
  if (today > nextEmiDate) {
    nextEmiDate = new Date(currentYear, currentMonth + 1, emiPaymentDay);
  }

  return nextEmiDate;
};

const MainPage = () => {
  const [userData, setUserData] = useState<{ username: string; walletAddress: string } | null>(null);
  const [userDetails, setUserDetails] = useState<{ amount_owes: number; emi_payment_day: number } | null>(null);
  const [nextEmiDate, setNextEmiDate] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve basic data from localStorage
    const username = localStorage.getItem("username");
    const walletAddress = localStorage.getItem("walletAddress");

    if (username && walletAddress) {
      setUserData({ username, walletAddress });

      // Fetch user details from the backend based on username or walletAddress
      fetch(`http://localhost:5000/users?username=${username}`)
        .then((response) => response.json())
        .then((data) => {
          const user = data[0]; // Assuming you get an array of users
          if (user) {
            setUserDetails({
              amount_owes: user.amount_owes,
              emi_payment_day: user.emi_payment_day,
            });

            // Calculate the next EMI date
            const nextDate = calculateNextEmiDate(user.emi_payment_day);
            setNextEmiDate(nextDate.toDateString()); // Set next EMI date in string format
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Main Page</h1>
        {userData && userDetails ? (
          <div>
            <p className="font-medium">Username: {userData.username}</p>
            <p className="font-medium">Wallet Address: {userData.walletAddress}</p>
            <p className="font-medium">Amount Owes: {userDetails.amount_owes}</p>
            <p className="font-medium">Next EMI Date: {nextEmiDate}</p>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
