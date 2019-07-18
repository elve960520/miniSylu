// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  var data = event;

  var contentList = await db.collection('content').where({
    _id: data.id // 填入当前用户 openid
  }).get()
  var contentList = contentList.data[0];

  commentList = contentList.commentList;
  console.log(commentList)
  commentList.push(data)
  console.log(commentList)
  var commentCount = commentList.length;
  return await db.collection('content').where({
    _id: data.id
  })
    .update({
      data: {
        commentList: commentList,
        commentCount: commentCount
      },
    })
}