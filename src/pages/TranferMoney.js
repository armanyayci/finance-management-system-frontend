import React, { useState, useEffect } from "react";
import ApiService from "../components/service/ApiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransferMoney = ({ setIsModalOpen }) => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [senderId, setSenderId] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");

    const fetchUserData = async () => {
      try {
        // 1️ Kullanıcı hesap bilgilerini al
        const accountResponse = await ApiService.GetAccountInfoByUsername(
          username
        );
        if (accountResponse.success) {
          setAccountInfo(accountResponse.data);
        }

        // 2 Tüm kullanıcıları çek ve username'e göre senderId'yi bul
        const usersResponse = await ApiService.GetAllUsers();
        const user = usersResponse.find((user) => user.username === username);
        if (user) {
          setSenderId(user.id);
        } else {
          toast.error("User not found!", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error occurred while fetching data!", {
          position: "top-right",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleTransfer = async () => {
    if (!amount || !recipient || !description) {
      toast.warn("Please fill in all fields!", { position: "top-right" });
      return;
    }

    if (parseFloat(amount) > accountInfo?.balance) {
      toast.error("Balance not enough!", { position: "top-right" });
      return;
    }

    if (!senderId) {
      toast.error("Sender ID not found!", { position: "top-right" });
      return;
    }

    const transferData = {
      senderId: senderId, // Burada senderId artık dinamik olarak username'e göre alınıyor
      code: recipient,
      money: parseFloat(amount),
      description: description,
    };

    try {
      const response = await ApiService.moneyTransfer(transferData);
      if (response.success) {
        toast.success("Money transfer successful!", { position: "top-right" });
        setTimeout(() => {
          window.location.reload();
          setIsModalOpen(false);
        }, 2000);
      } else {
        toast.error("Transfer failed!: " + response.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Transfer operation error:", error);
      toast.error("There was an error during transfer operation.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Transfer Money</h2>

      {accountInfo ? (
        <p className="mb-4">
          <strong>Available Balance:</strong> {accountInfo.balance}{" "}
          {accountInfo.accountType}
        </p>
      ) : (
        <p>Account Information Loading...</p>
      )}

      <label className="block mb-2">Recipient Code:</label>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
      />

      <label className="block mb-2">Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
      />

      <label className="block mb-2">Description:</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-400 text-white py-2 px-4 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleTransfer}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
};

export default TransferMoney;
