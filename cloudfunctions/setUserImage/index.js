// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-elve'
})
const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  console.log(data)

  //保存图片路径到数据库
  var imageList = await db.collection('userImage').where({
    xuehao: data.xuehao // 填入当前用户 openid
  }).get()
  console.log(imageList)
  imageList = imageList.data[0]
  if (imageList == null) {
    var result = await db.collection('userImage').add({
      data: data
    })
  } else {
    await cloud.deleteFile({
      fileList: [imageList.fileID],
    })
    var result = await db.collection('userImage').where({
      xuehao: data.xuehao
    })
      .update({
        data: data
      })
  }

  // 先取出集合记录总数
  const countResult = await db.collection('content').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('content').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  var ContentList = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  ContentList = ContentList.data
  for (let index = 0; index < ContentList.length; index++) {
    let elem = ContentList[index]
    console.log(elem)
    if(elem.xuehao == data.xuehao){
      await db.collection('content').where({
        _id: elem._id
      })
        .update({
          data:{
            userImage: data.fileID
          }
        })
    }
    let commentList = elem.commentList;
    for (let i = 0; i < commentList.length;i++){
      if (commentList[i].xuehao == data.xuehao){
        commentList[i].userImage = data.fileID
      }
    }
    await db.collection('content').where({
      _id: elem._id
    })
      .update({
        data: {
          commentList: commentList
        }
      })
  }
  // const res = await cloud.callFunction({
  //   // 要调用的云函数名称
  //   name: 'updataUserImage',
  //   // 传递给云函数的参数
  //   data: data,
  //   success:res=>{
  //     console.log("ok")
  //   }
  // })

  return result
}