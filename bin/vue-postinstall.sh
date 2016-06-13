mkdir temp
cd temp

# 1. vue (weex port)
git clone git@github.com:alibaba/weex-vue-next.git vue
cd vue
npm install
# make npm link: vue-weex
npm link
# build runtime and compiler
npm run build -- weex.common.js,weex.compiler.js

cd ..

# 2. vue-weex-loader
git clone git@github.com:alibaba/weex-loader-next.git loader
cd loader
npm install
npm link vue-weex
# make npm link: vue-weex-loader
npm link

cd ../../

npm link vue-weex
npm link vue-weex-loader
