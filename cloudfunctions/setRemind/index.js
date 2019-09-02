// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  const content = await db.collection('content').doc(data.message.id).get()
  const contentXuehao = content.data.xuehao;
  const contentText = content.data.text
  const hasRemind = await db.collection('remind').where({
    xuehao: contentXuehao // 填入当前用户 openid
  }).get()
  // console.log(content)
  if (hasRemind.data.length == 0) {
    await db.collection('remind').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        xuehao: contentXuehao,
        commentList: [],
        contentLikeList: [],
        commentLikeList: []
      }
    })
  }
  var remind = await db.collection('remind').where({
    xuehao: contentXuehao // 填入当前用户 openid
  }).get()
  // console.log(remind)
  if (data.origin == "publishComment") {//&& data.message.xuehao != remind.data[0].xuehao
    console.log("publishComment")
    // console.log(data.message)
    var insertData = {
      xuehao: data.message.xuehao,
      xingming: data.message.xingming,
      comment: data.message.value,
      text: contentText,
      id:data.message.id
    }
    var commentList = remind.data[0].commentList
    commentList.push(insertData)
    if (contentXuehao != data.message.xuehao)
    await db.collection("remind").where({
      xuehao: contentXuehao
    })
      .update({
        data: {
          commentList: commentList
        },
      })
  } else if (data.origin == "setContentLike") {//&& data.message.xuehao != remind.data[0].xuehao
    console.log("setContentLike")
    console.log(data.message)
    var insertData = {
      xuehao: data.message.xuehao,
      xingming: data.message.xingming,
      text: contentText,
      id:data.message.id
    }
    var contentLikeList = remind.data[0].contentLikeList
    contentLikeList.push(insertData)
    if (contentXuehao != data.message.xuehao)
    await db.collection("remind").where({
      xuehao: contentXuehao
    })
      .update({
        data: {
          contentLikeList: contentLikeList
        },
      })
  } else if (data.origin == "setCommentLike") {
    console.log("setCommentLike")
    console.log(data.message)//commentTime
    var commentList = content.data.commentList
    for (let index = 0; index < commentList.length;index++){
      if (commentList[index].time == data.message.commentTime){
        var commentXuehao = commentList[index].xuehao
        var commentText = commentList[index].value
      }
    }
    var remind = await db.collection('remind').where({
      xuehao: commentXuehao // 填入当前用户 openid
    }).get()
    var insertData = {
      xuehao: data.message.xuehao,
      xingming: data.message.xingming,
      id:data.message.id,
      text: contentText,
      commentTime: data.message.commentTime,
      commentText: commentText
    }
    var commentLikeList = remind.data[0].commentLikeList
    commentLikeList.push(insertData)
    if (commentXuehao != data.message.xuehao)
    await db.collection("remind").where({
      xuehao: commentXuehao
    })
      .update({
        data: {
          commentLikeList: commentLikeList
        },
      })
  }
}