import axios from "axios";

export default class ApiService{

    static BASE_URL1 ="http://localhost:8080/finance-mgmt"
    static BASE_URL2 = "http://localhost:8081/finance-mgmt"

    static getHeader (){
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    };

    // Auth && User Api
    static async registerUser(registiration){
        const response = await axios.post(`${this.BASE_URL1}/api/authenticate/signup`,registiration);
        return response.data;
    }
    static async Login(loginDetails){
        const response = await axios.post(`${this.BASE_URL1}/api/authenticate/login`,loginDetails);
        return response.data;
    }

    static async GetAccountInfoByUsername(username){
        const response = await axios.get(`${this.BASE_URL2}/api/account/get-account/${username}`);
        return response.data;
    }
}