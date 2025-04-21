export const myMixin = {
  methods: {
	   getChineseTimeDiff(t1, t2) {
	    const diff = Math.abs(t1 - t2);
	    const units = [
	      { value: 86400000, name: '天' }, 
	      { value: 3600000, name: '小时' }, 
	    ];
	  
	    let remaining = diff;
	    const result = units.map(unit => {
	      const val = Math.floor(remaining / unit.value);
	      remaining %= unit.value;
	      return { val, name: unit.name };
	    });
	    const output = result
	      .filter(item => item.val > 0)
	      .map(item => `${item.val}${item.name}`)
	      .join('');
	  
	    return output || '0秒';
	  },
	  /**
	   * 返回上一页
	   */
	  async customizeBack() {
	  	let canNavBack = await getCurrentPages()
	  	if (canNavBack && canNavBack.length > 1) {
	  		uni.navigateBack()
	  	} else {
	  		history.back();
	  	}
	  },
    /**
     *
     * 时间格式化
     * {parmars} str   utc时间
     * {returns} timeStr   格式化后的时间
     */
    initTime(str) {
		
      let timestamp = new Date(str).getTime()
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1000) : new Date(parseInt(
        timestamp))
      var y = time.getFullYear() // 年
      var m = time.getMonth() + 1 // 月
      if (m < 10) {
        m = '0' + m
      }
      var d = time.getDate() // 日
      if (d < 10) {
        d = '0' + d
      }
      var h = time.getHours() // 时
      if (h < 10) {
        h = '0' + h
      }
      var mm = time.getMinutes() // 分
      if (mm < 10) {
        mm = '0' + mm
      }
      var s = time.getSeconds() // 秒
      if (s < 10) {
        s = '0' + s
      }
      var timeStr = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
      return timeStr
    },
	// 年月日
	initDate(str) {
	  let timestamp = new Date(str).getTime()
	  var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1000) : new Date(parseInt(
	    timestamp))
	  var y = time.getFullYear() // 年
	  var m = time.getMonth() + 1 // 月
	  if (m < 10) {
	    m = '0' + m
	  }
	  var d = time.getDate() // 日
	  if (d < 10) {
	    d = '0' + d
	  }
	  var h = time.getHours() // 时
	  if (h < 10) {
	    h = '0' + h
	  }
	  var mm = time.getMinutes() // 分
	  if (mm < 10) {
	    mm = '0' + mm
	  }
	  var s = time.getSeconds() // 秒
	  if (s < 10) {
	    s = '0' + s
	  }
	  var timeStr = y + '-' + m + '-' + d
	  return timeStr
	}
  }
};


