import agent from "../../agent";

const encode = encodeURIComponent;
//const responseBody = res => res.body;

const requests = agent.agent.requests;

const Tags = {
    //getAll: () => requests.get("/user/users/tags"),
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const Usuarios = {
    all: (page) => requests.get(`/user?${limit(10, page)}`),
    //byAuthor: (author, page) =>
    //    requests.get(`/user/users?author=${encode(author)}&${limit(5, page)}`),
    //byTag: (tag, page) =>
    //    requests.get(`/user/users?tag=${encode(tag)}&${limit(10, page)}`),
    del: (username) => requests.del(`/user/users/${username}`),
    //favorite: (username) => requests.post(`/users/${username}/favorite`),
    //favoritedBy: (author, page) =>
    //    requests.get(`/user/users?favorited=${encode(author)}&${limit(5, page)}`),
    pedidos: (p) => {
        let tipo = (p.tipo) ? ('tipo=' + p.tipo + '&') : '';
        return requests.get(`/user/pedidos?${tipo}limit=10&offset=0`);
    },
    serveact: (act,username) => requests.get(`/user/serveract?act=${act}&username=${username}`),
    get: (username) => {
        return requests.get(`/user/user/${username}`);
    },
    //unfavorite: (username) => requests.del(`/users/${username}/favorite`),
    update: (user) =>
        requests.put(`/user/users/${user.username}`, {user}),
    create: (user) => requests.post("/user/users", {user}),
};

const Usrupdates = {
    create: (username, usrupdate) =>
        requests.post(`/user/${username}/usrupdates`, {usrupdate}),
    delete: (username, usrupdateId) =>
        requests.del(`/user/${username}/usrupdates/${usrupdateId}`),
    foruser: (username) => requests.get(`/user/${username}/usrupdates`),
};

const expd ={
    Usuarios,
    Usrupdates,
    Tags
};
export default expd;
