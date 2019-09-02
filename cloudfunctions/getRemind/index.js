// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data = event
  console.log(data)
  return await db.collection("remind").where({
    xuehao:data.xuehao
  }).get()
}