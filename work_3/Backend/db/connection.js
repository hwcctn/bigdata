const HBase = require('hbase');


/**
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = function(success, error) {
  // 设置默认的错误回调
  if (typeof error !== 'function') {
    error = () => {
      console.log(' 连接失败~~~');
    };
  }

  // 创建 HBase 客户端连接配置
  const client1 = HBase({ host: '192.168.136.100', port: 8081 });

  // 连接 HBase
  client1.table('student').scan({}, (err, rows) => {
    if (err) {
      console.log('连接失败', err);
      error();
    } else {
      console.log('HBase 连接成功');
      console.log('表内容:', rows);
  
        success(client1);  // 成功回调，传递 Redis 客户端对象
     
    }
  });
};
