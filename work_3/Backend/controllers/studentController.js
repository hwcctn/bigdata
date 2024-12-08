const config = {
  hosts: ["192.168.136.100"],
  port: "9090",
};

const HBase = require('node-thrift2-hbase')(config);

exports.addStudent = (req, res) => {
    const { StudentID, SName, SGender, SAge, SDepartment, SMajor } = req.body;

    // Correct usage of 'new' with Put
    const put = new HBase.Put(StudentID);

    // Add data
    put.add('SInfo', 'StudentID', StudentID);
    put.add('SInfo', 'SName', SName);
    put.add('SInfo', 'SGender', SGender);
    put.add('SInfo', 'SAge', SAge);
    put.add('Studies', 'SDepartment', SDepartment);
    put.add('Studies', 'SMajor', SMajor);

    // Insert data into HBase table 'Students'
    HBase.putAsync('Students', put)
        .then(() => {
            res.status(200).json({ message: 'Student added successfully' });
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(500).json({ error: `Error adding student: ${err}` });
        });
};

// 查询学生信息
exports.getStudent = (req, res) => {
  const { StudentID } = req.params;

  // 创建 Get 请求来查询 HBase 表 'Students' 中的学生数据
  const get =new HBase.Get(StudentID);  // 使用 StudentID 作为行键

  // 添加查询列族和列名
  get.addFamily('SInfo');  // 获取 'SInfo' 列族中的所有列
  get.addFamily('Studies');  // 获取 'Studies' 列族中的所有列

  // 使用 getAsync 来异步查询数据
  HBase.getAsync('Students', get)
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // 格式化返回的列数据
      const resData=[]
      const studentData = {};
      data.columnValues.forEach((colVal) => {
        const family = colVal.family.toString();
        const qualifier = colVal.qualifier.toString();
        const value = colVal.value.toString(); // 或者根据需要转换为其他类型
        if (!studentData[family]) {
          studentData[family] = {};
        }
        studentData[family][qualifier] = value;
        
      });
      resData.push(studentData)
      res.status(200).json({
        msg:'成功',
        data:resData
      });
    })
    .catch((err) => {
      console.error('Error fetching student data:', err);
      res.status(500).json({ error: `Error fetching student: ${err}` });
    });
};
// 查询所有学生
exports.getStudents=(req,res)=>{
  const tableName = 'Students';
 const scanObject = new
 HBase.Scan({                   
            
    });
    HBase
    .createScanStream(tableName, scanObject)
    .on('data', rows => {
      //      // 创建一个数组来存储所有学生数据
     const allStudents = [];

     // 遍历整个 data 数组，处理每个学生数据
     rows.forEach((rowData) => {
          const studentData = {};
          rowData.columnValues.forEach((colVal) => {
        const family = colVal.family.toString();
        const qualifier = colVal.qualifier.toString();
        const value = colVal.value.toString(); // 或者根据需要转换为其他类型
        if (!studentData[family]) {
          studentData[family] = {};
        }
        studentData[family][qualifier] = value;
      });
 
       // 将每个学生的记录添加到 allStudents 数组中
       allStudents.push(studentData);
     });
 
      res.status(200).json({
        data:allStudents
      })
        console.log(`Received ${rows.length} rows...`);
    })
    .on('error', err => {
      res.status(500).json({
        msg:"失败",
        data:null
      })
    })
    .on('end', () => {
        console.log('scan ended');
    });
  }

