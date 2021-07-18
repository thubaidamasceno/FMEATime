const gens = {
    m: (m, f) => m,
    f: (m, f) => f,
};
const nums = {
    s: (s, p) => s,
    p: (s, p) => p,
};
const cass = {
    n: (n, c) => n,
    c: (n, c) => c,
    cam: (s) => s[0].toUpperCase() + s.substr(1),
    nor: (s) => s
};
const g = gens, c = cass, n = nums;

const txt = {
    g: gens,
    c: cass,
    n: nums,
    _: undefined,
    _oserv: {gen: gens.m},
    usuario: (num = nums.o, cas = cass.n, gen = gens.m) =>
        `${cas('u', 'U')}suári${gen('o', 'a')}${num('', 's')}`,

    oa: (gen = gens.m, num = nums.o, cas = cass.n) =>
        cas(cass.nor, cass.cam)(`${gen('o', 'a')}${num('', 's')}`)

    , vmnewmin: "abrir"
    , vmnewmai: "Abrir"
    , vmeditmai: "Editar"
    , vmsavemai: "Salvar"
    //
    , readmore: "ver detalhes >>"
    , datetimefmt: 'DD/MM/YY HH:mm'
};

const roleabl = {
    dev:[{action: 'manage', subject: 'all'},],
    admin:[{action: 'resetpass', subject: 'users'},
        {action: 'open', subject: ['usuarios']},],
    user:{},
    guest:{},
};

// export
const fields_new = (() => {
    let fn = {
        'nome': {
            texto: 'Nome e Sobrenome',
            db: {type: String, unique: true, required: [true, "não pode estar em branco"]}
        },
        'username': {
            texto: 'Login',
            db: {type: String}
        },
        'tipo':{},
        'slug':{},
        'telefone': {texto: '(DDD) Telefone'},
        'setor': {texto: 'Setor'},
        'funcao': {texto: 'Função'},
        'genero': {texto: 'Gênero'},
        'mensagem1': {texto: 'Quer  deixar mensagem?'},
        'email': {texto: 'E-mail'},
        'password': {texto: 'Senha'},
        'confirmation': {texto: 'Confirmação de Senha'},
    };
    for (let k in fn) {
        if (!fn[k].prop) fn[k].prop = k;
        if (!fn[k].tipo) fn[k].type = 'txt';
    }
    return fn;
})();
module.exports = {t: txt, fields_new, roleabl};