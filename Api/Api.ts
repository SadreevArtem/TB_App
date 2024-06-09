class API {
    baseUrl: string;
    token: string;
    constructor(baseUrl: string, token: string) {
      this.baseUrl = baseUrl
      this.token = token
    }
    signInRequest = (input: {username: string, password: string}) => fetch(`${this.baseUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
};

export const api = new API('http://localhost:3000', '')