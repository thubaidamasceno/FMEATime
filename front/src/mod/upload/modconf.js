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
    _upload: {gen: gens.m},
    upload: (num = nums.s, cas = cass.n) =>
        `${cas('o', 'O')}rde${num('m', 'ns')} de ${cas('s', 'S')}erviço`,
    OS: (num = n.s, cas = c.n) =>
        `OS${num('', 's')}`,

    oa: (gen = gens.m, num = nums.s, cas = cass.n) =>
        cas(cass.nor, cass.cam)(`${gen('o', 'a')}${num('', 's')}`)

    , vmnewmin: "abrir"
    , vmnewmai: "Abrir"
    , vmeditmai: "Editar"
    , vmsavemai: "Salvar"
    //
    , readmore: "ver detalhes >>"
    , datetimefmt: 'DD/MM/YY HH:mm'
};
//
const fields_new = {
    'title': {
        prop: 'title', texto: '', tipo: 'txt', hidden: 1
    },
    'description': {
        prop: 'description', texto: '', tipo: 'txt', hidden: 1
    },
    'body': {
        prop: 'body', texto: '', tipo: 'txt', hidden: 1
    },
    // 'tagList': {
    //     prop: 'tagList', texto: '', tipo: 'txt', hidden: 1
    // },
    'osnumber': {
        prop: 'title', texto: 'Nº OS', tipo: 'txt'
    },
    'osn': {
        prop: 'osn', texto: '', tipo: 'num', hidden: 1
    },
    'dt_abr': {
        prop: 'dt_abr', texto: 'Aberta em', tipo: 'dt'
    },
    'dt_rec': {
        prop: 'dt_rec', texto: 'Recebida em', tipo: 'dt'
    },
    'dt_exe': {
        prop: 'dt_exe', texto: 'Executada em', tipo: 'dt'
    },
    'dt_ok': {
        prop: 'dt_ok', texto: 'Aceita em', tipo: 'dt'
    },
    'dt_para': {
        prop: 'dt_para', texto: 'Parou em', tipo: 'dt'
    },
    'dt_reini': {
        prop: 'dt_reini', texto: 'Reiniciou em', tipo: 'dt'
    },
    'usr_abr': {
        prop: 'usr_abr', texto: 'Aberta por', tipo: 'txt'
    },
    'usr_rec': {
        prop: 'usr_rec', texto: 'Recebida por', tipo: 'txt'
    },
    'usr_exe': {
        prop: 'usr_exe', texto: 'Executada por', tipo: 'txt'
    },
    'usr_ok': {
        prop: 'usr_ok', texto: 'Aceita por', tipo: 'txt'
    },
    'equip': {
        prop: 'equip', texto: 'Equipamento', tipo: 'txt'
    },
    'reg': {
        prop: 'reg', texto: 'Região', tipo: 'txt'
    },
    'solicita': {
        prop: 'solicita', texto: 'Solicitação/Problema', tipo: 'txt'
    },
    'executado': {
        prop: 'executado', texto: 'Solução/Execução', tipo: 'txt'
    },
    'partlist': {
        prop: 'partlist', texto: 'Peças (usadas ou solicitações de compra', tipo: 'txt'
    },
    'observ': {
        prop: 'solution', texto: 'Observações', tipo: 'txt'
    },
    'analise': {
        prop: 'analise', texto: 'Análise', tipo: 'txt'
    },
    //
};
module.exports = {t: txt ,txt, gens, cass, nums, fields_new};