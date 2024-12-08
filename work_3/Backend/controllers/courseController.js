const redis = require('redis');
const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

redisClient.connect()
  .then(() => {
    console.log('Redis 连接成功');
  })
  .catch(err => {
    console.error('Redis 连接失败:', err);
  });
// 添加课程
exports.addCourse = async (req, res) => {
  const course = req.body;
  console.log('Received course data:', course);

  try {
    // 删除现有数据以避免重复存储问题
    const existingCourse = await redisClient.hGetAll(`CInfo:${course.CourseID}`);
    if (Object.keys(existingCourse).length > 0) {
      // 如果课程已经存在，直接返回已有数据
      console.log(`Course ${course.CourseID} already exists.`);
      return res.status(200).json({
        message: '该课程已存在。',
        data: existingCourse, // 返回现有数据
      });
    }
    // 存储课程信息
    const result1 = await redisClient.hSet(`CInfo:${course.CourseID}`, {
      CName: course.CName,
      Credit: course.Credit,
      Time: course.Time,
    });
    console.log(`Stored course info with result: ${result1}`);

    // 存储教学信息
    const result2 = await redisClient.hSet(`Teaching:${course.CourseID}`, {
      Teacher: course.Teacher,
      Title: course.Title,
    });
    console.log(`Stored teaching info with result: ${result2}`);

    // 验证数据存储
    const storedData = await redisClient.hGetAll(`CInfo:${course.CourseID}`);
    console.log('Stored course data:', storedData);

    res.status(200).json({
      message: '课程信息和教学信息导入成功',
    });
  } catch (err) {
    console.error('Error adding course to Redis:', err);
    res.status(500).json({
      code: '1001',
      msg: '添加失败~~~',
      data: null,
    });
  }
};

// 
// 查询课程

exports.getCourse = async (req, res) => {
  const { CourseID } = req.params;
  console.log(CourseID)

  try {
    // 获取课程信息（CInfo 列族）
    const courseInfo = await redisClient.hGetAll(`CInfo:${CourseID}`);
    
    if (!courseInfo || Object.keys(courseInfo).length === 0) {
      return res.status(404).json({ error: 'Course info not found' });
    }

    // 获取教学信息（Teaching 列族）
    const teachingInfo = await redisClient.hGetAll(`Teaching:${CourseID}`);
    if (!teachingInfo || Object.keys(teachingInfo).length === 0) {
      return res.status(404).json({ error: 'Teaching info not found' });
    }

    // 合并课程信息和教学信息
    const fullCourseData = {
      CourseID,
      ...courseInfo,
      ...teachingInfo
    };
console.log(fullCourseData);

    res.status(200).json({
      message: 'Course retrieved successfully',
      data: [fullCourseData]
    });

  } catch (err) {
    console.error('Error retrieving course data from Redis:', err);
    res.status(500).json({
      code: '1002',
      msg: '查询失败~~~',
      data: null
    });
  }
};
// 查询所有课程
exports.getAllCourses = async (req, res) => {
  try {
    // 扫描所有以 CInfo: 开头的键
    const courseKeys = await redisClient.keys('CInfo:*');
    console.log('Course Keys:', courseKeys);

    if (!courseKeys || courseKeys.length === 0) {
      return res.status(404).json({ error: 'No courses found' });
    }

    // 获取所有课程信息
    const allCourses = [];

    // 获取每个课程的详细信息
    for (const key of courseKeys) {
      const courseInfo = await redisClient.hGetAll(key);
      const CourseID = key.split(':')[1]; // 提取课程ID

      if (courseInfo && Object.keys(courseInfo).length > 0) {
        // 获取对应的教学信息
        const teachingInfo = await redisClient.hGetAll(`Teaching:${CourseID}`);
        
        // 合并课程信息和教学信息
        const fullCourseData = {
          CourseID,
          ...courseInfo,
          ...teachingInfo,
        };

        allCourses.push(fullCourseData);
      }
    }

    res.status(200).json({
      message: 'All courses retrieved successfully',
      data: allCourses
    });

  } catch (err) {
    console.error('Error retrieving all course data from Redis:', err);
    res.status(500).json({
      code: '1003',
      msg: '查询所有课程失败~~~',
      data: null
    });
  }
};


