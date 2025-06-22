import React, { useState, useEffect } from "react";
import ApiService from "../components/service/ApiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowPathIcon,
  UserCircleIcon,
  BanknotesIcon,
  PencilSquareIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const TransferMoney = ({ setIsModalOpen }) => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [senderId, setSenderId] = useState(null);
  const [error, setError] = useState("");

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
    setError("");
    if (!amount || !recipient || !description) {
      setError("Please fill in all fields!");
      toast.warn("Please fill in all fields!", { position: "top-right" });
      return;
    }

    if (parseFloat(amount) > accountInfo?.balance) {
      setError("Balance not enough!");
      toast.error("Balance not enough!", { position: "top-right" });
      return;
    }

    if (!senderId) {
      setError("Sender ID not found!");
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
        setError(response.message || "Transfer failed!");
        toast.error("Transfer failed!: " + response.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      setError("There was an error during transfer operation.");
      console.error("Transfer operation error:", error);
      toast.error("There was an error during transfer operation.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative animate-fadeInUp scale-95 sm:scale-100 transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-2xl rounded-3xl w-[95vw] max-w-md p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-8 bg-gradient-to-r from-blue-500 to-blue-400 mb-8">
          <ArrowPathIcon className="w-14 h-14 text-white drop-shadow-lg mb-2 animate-spin-slow" />
          <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
            Transfer Money
          </h2>
        </div>
        {/* Balance Card */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-md px-5 py-3 mx-6 -mt-8 mb-4 border border-blue-100">
          <BanknotesIcon className="w-8 h-8 text-green-500" />
          {accountInfo ? (
            <div>
              <div className="text-lg font-bold text-gray-800">
                {accountInfo.balance} {accountInfo.accountType}
              </div>
              <div className="text-xs text-gray-500">Available Balance</div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Account Information Loading...
            </div>
          )}
        </div>
        {/* Error/Warning */}
        {error && (
          <div className="mx-6 mb-2 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
            <PencilSquareIcon className="w-5 h-5 text-red-400" />
            {error}
          </div>
        )}
        {/* Form */}
        <div className="px-8 pb-8 pt-2">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <UserPlusIcon className="w-5 h-5 text-blue-400" /> Recipient Code
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-gray-800 bg-blue-50"
              placeholder="Enter recipient code"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <BanknotesIcon className="w-5 h-5 text-green-400" /> Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors text-gray-800 bg-blue-50"
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <PencilSquareIcon className="w-5 h-5 text-purple-400" />{" "}
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors text-gray-800 bg-blue-50"
              placeholder="What is this for?"
            />
          </div>
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold shadow hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-bold shadow hover:from-blue-600 hover:to-green-600 transition-colors"
            >
              Confirm Transfer
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s cubic-bezier(.4,2,.3,1) both; }
        .animate-spin-slow { animation: spin 2.5s linear infinite; }
      `}</style>
    </div>
  );
};

export default TransferMoney;
