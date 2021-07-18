import agent from "../../agent";

const encode = encodeURIComponent;
//const responseBody = res => res.body;

const requests = agent.agent.requests;

const Tags = {
    getAll: () => requests.get("/uploads/tags"),
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = (upload) => Object.assign({}, upload, {slug: undefined});

const Uploads = {
    all: (page) => requests.get(`/uploads?${limit(10, page)}`),
    byAuthor: (author, page) =>
        requests.get(`/uploads?author=${encode(author)}&${limit(5, page)}`),
    byTag: (tag, page) =>
        requests.get(`/uploads?tag=${encode(tag)}&${limit(10, page)}`),
    del: (slug) => requests.del(`/uploads/${slug}`),
    favorite: (slug) => requests.post(`/uploads/${slug}/favorite`),
    favoritedBy: (author, page) =>
        requests.get(`/uploads?favorited=${encode(author)}&${limit(5, page)}`),
    feed: () => requests.get("/uploads/feed?limit=10&offset=0"),
    get: (slug) => requests.get(`/uploads/${slug}`),
    unfavorite: (slug) => requests.del(`/uploads/${slug}/favorite`),
    serveact: (act,slug) => requests.get(`/uploads/serveract?act=${act}&slug=${slug}`),
    update: (upload) =>
        requests.put(`/uploads/${upload.slug}`, {upload: omitSlug(upload)}),
    create: (upload) => requests.post("/uploads", {upload}),
};

const Uplinks = {
    create: (slug, uplink) =>
        requests.post(`/uploads/${slug}/uplinks`, {uplink}),
    delete: (slug, uplinkId) =>
        requests.del(`/uploads/${slug}/uplinks/${uplinkId}`),
    forUpload: (slug) => requests.get(`/uploads/${slug}/uplinks`),
};


const expd= {
    Uploads,
    Uplinks,
    Tags
};
export default expd;