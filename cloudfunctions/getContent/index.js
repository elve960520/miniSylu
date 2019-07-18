// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  //console.log(data)
  var contentList =  await db.collection('content').where({
    tabCur: data.tabCur 
  }).orderBy('time', 'desc')
    .skip(data.page*10)
    .limit(10)
    .get();
  return contentList;
}