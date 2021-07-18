c:
cd \h\proj\fmeatime
set NODE_ENV = 'production'

git commit -a -m ok
git push
ssh dng0@damasceno.pro "cd /srv/fmeatime && git stash && git pull"
REM ssh dng0@damasceno.pro "curl -k https://fmeatime.damasceno.pro:48755/reload/reload"
cd front
REM yarn build
REM react-scripts build
rm -rf www
cp -r build www
tar -zcvf www.tar.gz www 
scp www.tar.gz dng0@damasceno.pro:/srv/fmeatime
ssh dng0@damasceno.pro "cd /srv/fmeatime && tar -zxvf www.tar.gz"
