const roles = {

    root: [{action: 'manage', subject: 'all'}],

    admin: [{action: 'resetpass', subject: 'users'}],

    lidermanut: [{action: 'editos'}],

    tecnico: [{action: 'editos'}],

    liderprod: [{action: 'editos'}],

    reader: [],
};

module.exports = roles;

