// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  var contentList = await db.collection('content').where({
    _id: data.contentId // 填入当前用户 openid
  }).get()
  var contentList = contentList.data[0];
  commentList = contentList.commentList;
  for(let index = 0;index<commentList.length;index++){
    if (data.commentTime == commentList[index].time){
      var goodList = commentList[index].goodList;
      var goodCount = goodList.length;
      if (goodList.includes(data.xuehao)) {
        let index = goodList.indexOf(data.xuehao);
        goodList.splice(index, 1);
        goodCount = goodCount - 1;
      } else {
        goodList.push(data.xuehao);
        goodCount = goodCount + 1;
      }
      commentList[index].goodList = goodList;
      commentList[index].goodCount = goodCount;
      break;
    }
  }
  console.log(commentList)
  return await db.collection('content').where({
    _id: data.contentId
  })
    .update({
      data: {
        commentList: commentList
      },
    })
}