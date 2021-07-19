certbot -n --agree-tos --non-interactive \
	-d fmeatime.damasceno.pro \
	-d demo.fmeatime.damasceno.pro \
	-d www.fmeatime.damasceno.pro \
	-m thubaidamasceno@gmail.com certonly  \
	--cert-name fmeatime.damasceno.pro  \
	--preferred-challenges http  \
	--http-01-port 8008 --webroot  -w ./www  \
	--keep-until-expiring --rsa-key-size 4096  \
	--config-dir ./certs/

cd certs
cp live/fmeatime.damasceno.pro/cert.pem ./fmeatime.damasceno.pro.cert
cp live/fmeatime.damasceno.pro/privkey.pem ./fmeatime.damasceno.pro.priv
cp live/fmeatime.damasceno.pro/fullchain.pem ./fmeatime.damasceno.pro.full
cp live/fmeatime.damasceno.pro/chain.pem ./fmeatime.damasceno.pro.chain

chmod +r fmeatime.damasceno.pro.*
