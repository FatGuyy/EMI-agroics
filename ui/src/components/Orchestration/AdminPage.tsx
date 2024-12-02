import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  your_address: string;
  amount_owes: number;
  preference_currency_1: string;
  preference_currency_2: string;
  preference_currency_3: string;
  emi_payment_day: number;
  lenders_address: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all users from Flask backend
    fetch('http://localhost:5000/users')  // Adjust URL if necessary
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const handleAmountChange = (id: number, newAmount: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, amount_owes: newAmount } : user
      )
    );
  };

  const handleSubmit = (id: number, newAmount: number) => {
    // Send the updated amount to the backend
    fetch(`http://localhost:5000/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount_owes: newAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error updating amount owes:', error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Page</h1>
      <table className="table-auto w-full border-collapse mx-auto">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-center">Username</th>
            <th className="border-b px-4 py-2 text-center">Wallet Address</th>
            <th className="border-b px-4 py-2 text-center">Amount Owes</th>
            <th className="border-b px-4 py-2 text-center">Update Amount Owes</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border-b px-4 py-2 text-center">{user.username}</td>
              <td className="border-b px-4 py-2 text-center">{user.your_address}</td>
              <td className="border-b px-4 py-2 text-center">{user.amount_owes}</td>
              <td className="border-b px-4 py-2 text-center">
                <input
                  type="number"
                  value={user.amount_owes || ''}
                  onChange={(e) =>
                    handleAmountChange(user.id, parseInt(e.target.value) || 0)
                  }
                  className="border px-2 py-1 text-center"
                />
                <button
                  onClick={() => handleSubmit(user.id, user.amount_owes)}
                  className="ml-2 p-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
