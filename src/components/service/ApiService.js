import axios from "axios";

export default class ApiService {
  // static BASE_URL1 = "http://localhost:8080/finance-mgmt";
  // static BASE_URL2 = "http://localhost:8081/finance-mgmt";
  // static BASE_URL3 = "http://localhost:8084/finance-mgmt";
  // static BASE_URL4 = "http://localhost:8083/finance-mgmt";

  static BASE_URL1 = "http://localhost:8086";
  static BASE_URL2 = "http://localhost:8086";
  static BASE_URL3 = "http://localhost:8086";
  static BASE_URL4 = "http://localhost:8086";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Auth && User Api
  static async registerUser(registiration) {
    const response = await axios.post(
      `${this.BASE_URL1}/api/authenticate/signup`,
      registiration
    );
    return response.data;
  }
  static async Login(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL1}/api/authenticate/login`,
      loginDetails
    );
    return response.data;
  }

  static async GetAccountInfoByUsername(username) {
    const response = await axios.get(
      `${this.BASE_URL2}/api/account/get-account/${username}`
    );
    return response.data;
  }
  static async moneyTransfer(transferInfo) {
    const response = await axios.post(
      `${this.BASE_URL2}/api/account/money-transfer`,
      transferInfo
    );
    return response.data;
  }
  static async GetAllUsers() {
    const response = await axios.get(`${this.BASE_URL3}/api/users`);
    return response.data;
  }
  static async GetUserById(userİd) {
    const response = await axios.get(`${this.BASE_URL3}/api/users`, {
      params: { id: userİd },
    });
    return response.data;
  }
  static async getExpenseRate(username, startDate, endDate) {
    const response = await axios.get(
      `${this.BASE_URL2}/api/account/expense-rate/${username}/${startDate}/${endDate}`
    );
    return response.data;
  }
  static async buyCurrency(currencyConversionRequest) {
    const response = await axios.post(
      `${this.BASE_URL4}/api/currency-exchange/buy`,
      currencyConversionRequest,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async getUserCurrencies(userId) {
    const response = await axios.get(
      `${this.BASE_URL4}/api/currency-exchange/get-user-currencies`,
      { params: { userId } }
    );
    return response.data;
  }
  static async sellCurrency(currencyConversionRequest) {
    const response = await axios.post(
      `${this.BASE_URL4}/api/currency-exchange/sell`,
      currencyConversionRequest,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async changePassword(passwordChangeRequest) {
    const response = await axios.post(
      `${this.BASE_URL1}/api/authenticate/change-password`,
      passwordChangeRequest,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async uploadProfileImage(userId, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${this.BASE_URL3}/api/users/add-image/${userId}`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
  static async addGoal(goals) {
    const response = await axios.post(
      `${this.BASE_URL3}/api/users/add-goal`,
      goals,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async getGoals(userId) {
    const response = await axios.get(
      `${this.BASE_URL3}/api/users/get-goals/${userId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async deleteGoal(goalId) {
    const response = await axios.delete(
      `${this.BASE_URL3}/api/users/delete-goal/${goalId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async openAccount(createAccountDTO) {
    const response = await axios.post(
      `${this.BASE_URL2}/api/account/add-account`,
      createAccountDTO,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async getExpenses(username) {
    const response = await axios.get(
      `${this.BASE_URL2}/api/expense/get-expenses`,
      { params: { username }, headers: this.getHeader() }
    );
    return response.data;
  }
  static async addExpense(username, expenseDTO) {
    const response = await axios.post(
      `${this.BASE_URL2}/api/expense/add-expense/${username}`,
      expenseDTO,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async deleteExpense(expenseId) {
    const response = await axios.delete(
      `${this.BASE_URL2}/api/expense/delete-expense/${expenseId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async updateExpense(expenseId, expenseDTO) {
    const response = await axios.put(
      `${this.BASE_URL2}/api/expense/update-expense/${expenseId}`,
      expenseDTO,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async enable2FA(userId, enable2FA) {
    const response = await axios.post(
      `${this.BASE_URL1}/api/authenticate/enable-2fa`,
      { userId, enable2FA },
      { headers: this.getHeader() }
    );
    return response.data;
  }
  static async verify2FA(username, verificationCode) {
    const response = await axios.post(
      `${this.BASE_URL1}/api/authenticate/verify-2fa`,
      { username, verificationCode }
    );
    return response.data;
  }
}
