const redis = require('redis');
const client = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

client.connect()
  .then(() => {
    console.log('Redis 连接成功');
  })
  .catch(err => {
    console.error('Redis 连接失败:', err);
  });
// 学生选课

exports.selectCourse = async (req, res) => {
  const { CourseID, StudentID, Score } = req.body;
  console.log("123",CourseID);
  
  try {
    const Data = await client.hSet(`selection:${StudentID}:${CourseID}`, {
      CourseID: CourseID,
      Score: Score
    })
    console.log('Stored course data:', Data);
    const result= await getAllSelection(StudentID)
    const courseIDs=result.map(item=>item.CourseID)
    res.status(200).json({
      message: '课程信息和教学信息导入成功',
      data: courseIDs
    });
  }
  catch (err) {
    console.error('Error adding recodr to Redis:', err);
    res.status(500).json({
      code: '1001',
      msg: '添加失败~~~',
      data: null,
    });
  }

};

// 查询选课记录
// 查询学生选了多少门课程
exports.getSelection = async (req, res) => {
  try {
    const { StudentID } = req.params;
    const result= await getAllSelection(StudentID)
    if(result==null){
      return res.status(500).json({
        message: '没有数据',
        data: result
      });
    }
      console.log("123", result);
      
    res.status(200).json({
      message: 'All courses retrieved successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      code: '1003',
      msg: '查询所有记录失败~~~',
      data: err
    });
  }

}
const getAllSelection = async (StudentID) => {
  try {
    const coursesKeys = await client.keys(`selection:${StudentID}:*`);
    if (!coursesKeys || coursesKeys.length === 0) {
      return null;
    }

    const allCourses = [];
    for (const key of coursesKeys) {
      const courseInfo = await client.hGetAll(key);
      allCourses.push(courseInfo);
    }
    console.log(allCourses);
    
    return allCourses;
  } catch (err) {
    console.error('Error retrieving courses:', err);
    throw err; // 将错误传递给调用者
  }
};



