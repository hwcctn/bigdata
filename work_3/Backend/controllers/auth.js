var express = require('express');
var router = express.Router();
const jwt=require('jsonwebtoken')
const config = {
    hosts: ["192.168.136.100"],
    port: "9090",
  };
  
  const HBase = require('node-thrift2-hbase')(config);


exports.Login =async (req,res)=>{
    try{ 
        let {username,ID}=req.body
        if(username==="zhuxiaorui"&&ID==="2200520307"){
              // 创建token
              let token =jwt.sign({
                username:username,
                id:ID,
                identity:"管理员"
            },'zhuxiaorui',{
                expiresIn:60*60*24*7
            })
            return res.json({
                code:'200',
                msg:'登录成功',
                
                    token:token,
                    username:"zhuxiaorui",
                    id:ID,
                    identity:"管理员",
                    
                
            })  
        }
    // 构建 Get 请求，指定行键和列
    const get = new HBase.Get(ID);
    get.addColumn('SInfo', 'SName'); 

    // 查询 HBase 数据
    const result = await HBase.getAsync('Students', get);
        console.log(result);
        
    if (result.length === 0) {
      return res.status(404).json({ code:'401',message: '学生不存在',data:null });
    }

    // 提取查询结果
    let name = null;
    result.columnValues.forEach((col) => {
      if (col.family.toString() === 'SInfo' && col.qualifier.toString() === 'SName') {
        name = col.value.toString();
      }
    });
 console.log(name);
 
    // 比较姓名
    if (name === username) {
        let token =jwt.sign({
            username:name,
            id:ID,
            identity:"学生"
        },'zhuxiaorui',{
            expiresIn:60*60*24*7
        })
      res.status(200).json({ 
        code:'200',
        token:token,
        message: '学生存在', 
        studentID: ID,
        studentname:name,
        identity:"学生"

    
    });
    } else {
      res.status(404).json({ code:'404',message: '学生不存在或姓名不匹配' });
    } 
    }
    catch(err){
        
        res.json({
            code:'2001',
            msg:'数据库读取失败',
            data:null
        })  
    }
 
}

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
exports.Logout=async (req,res)=>{
    try {
        const {token} = req.body;
        const decoded = jwt.decode(token); // 解码 token 获取过期时间  
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // 计算 token 剩余时间
        // 将 token 加入 Redis 黑名单，并设置过期时间
        await redisClient.set(`blacklist:${token}`, '1', 'EX', expiresIn);
        res.json({ message: '退出成功，token 已失效',data:'1' });
    } catch (err) {
        res.status(500).json({ message: '退出登录失败', error: err.message,data:'0' });
    }
}
exports.authenticate = async (req, res) => {
    try {
        const {token} = req.body;
        // 检查 token 是否在 Redis 黑名单中
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token 已失效，请重新登录' ,data:null});
        }
        
        // 验证 token
        jwt.verify(token, 'zhuxiaorui', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token 无效' });
            }
            // req.user = decoded; // 将解析后的信息放入 req 对象中
            return res.status(200).json({ message: 'Token 有效',data:decoded });
        });
    } catch (err) {
        res.status(500).json({ message: 'Token 验证失败', error: err.message });
    }
};


