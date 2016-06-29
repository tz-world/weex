PREFIX=`realpath $(cd "$(dirname "$0")"; pwd)/..`

cd $PREFIX

python po4a.py

cd $PREFIX/doc/zh-cn
gitbook build

