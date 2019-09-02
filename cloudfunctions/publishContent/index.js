// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  console.log(event);
  var data = event;
  // data.time = new Date();
  try {
    return await db.collection('content').add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}