git commit -a -m ok
git push
ssh dng0@damasceno.pro "cd /srv/fmeatime && git stash && git pull && cd /home/dng0/bemtevi && docker-compose restart api_fmeatime"
