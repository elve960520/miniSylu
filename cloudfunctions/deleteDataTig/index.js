// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-elve'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var list = await db.collection('content').where({
      time: _.lt((new Date()).getTime() - 604800000)//604800000
    }).get()
    var deleteList = list.data;
    for(let index = 0;index<deleteList.length;index++){
      let elem = deleteList[index].fileIdList
      if(elem.length>0){
        console.log(elem)
        await cloud.deleteFile({
          fileList: elem
        })
      }
    }
    await db.collection('content').where({
      time: _.lt((new Date()).getTime() - 604800000)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}