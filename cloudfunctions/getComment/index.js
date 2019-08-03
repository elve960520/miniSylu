// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  console.log(data)
  var contentList = await db.collection('content').where({
    _id: data.id
  })
    .get();
  var contentList = contentList.data[0];
  console.log(contentList.commentList);
  var commentList = contentList.commentList;
  return commentList;
}