const config = {
    // secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
    secret: process.env.SECRET ? process.env.SECRET : 'fmeatime',
    superuser: process.env.superuser ? process.env.superuser : 'damasceno',
    database: process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://mongo/fmeatime',
    redisString: {
        host: process.env.REDIS_HOST || 'redis', port: process.env.REDIS_PORT || '6379',
        uri: process.env.REDIS_URI || "redis://redis:6379/0"
    }
};

module.exports = config;