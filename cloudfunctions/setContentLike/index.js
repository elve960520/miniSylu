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
    _id: data.id // 填入当前用户 openid
  }).get()
  var contentList = contentList.data[0];
  goodList = contentList.goodList;
  var goodCount = goodList.length;
  if (goodList.includes(data.xuehao)){
    let index = goodList.indexOf(data.xuehao);
    goodList.splice(index,1);
    goodCount = goodCount-1;
  }else{
    goodList.push(data.xuehao);
    goodCount = goodCount + 1;
  }

  console.log(goodList)
  console.log(goodCount)

  return await db.collection('content').where({
    _id: data.id
  })
    .update({
      data: {
        goodList: goodList,
        goodCount: goodCount
      },
    })
}