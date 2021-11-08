import EventEmitter from 'eventemitter3'
import 'intersection-observer';
// 延迟时间，节流作用
IntersectionObserver.prototype['THROTTLE_TIMEOUT'] = 300;
class BuriedPoint extends EventEmitter {
    constructor(maxNum = 10) {
        super(maxNum)
        this.dataList = [];
        this.maxNum = maxNum;
        this.time = 10000; // 延迟上报时间
        this.dataList = [];
        this.maxNum = maxNum; // 一次上报最大个数
        this._observer = null;
        this._timer = null;
        this.init();
    }

    // 初始化
    init(entry) {
        this.on('collect', this.collect)
        this.exposureObserver()
       
    }
    getCustomAttributesValue(element) {
        try{
            const eventParamJson = entry.target.attributes['monitor-exposure'].value;
            const eventParam = JSON.parse(eventParamJson)
            return eventParam
        }catch(e){
            throw new Error(e)
        }  
    }
    /**
     * 曝光
     */
    exposureObserver() {
        const IO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { // 进入视图触发
                    try {
                        const eventParam = this.getCustomAttributesValue(entry)
                        this.emit('collect', eventParam)
                    } catch (err) {
                        console.log(err);
                    }
                }
            })
        }, { 
            root: document.querySelector('body'),
            rootMargin: "0px",
            threshold: 1 // 目标dom出现在视图的比例 0 - 1
        });
        let ele = document.querySelectorAll('[monitor-exposure]');
        ele.forEach((ele, index) => {
            IO && IO.observe(ele)
        })
    }
    /**
     * 收集
     * @param {*} params 
     */
    collect(eventParam) {
        this.dataList.push({
            eventParam: eventParam
        });
        // this._timer && clearTimeout(this._timer); // 清除定时器
        // 已经上报的节点、取消对该DOM的观察
        // self._observer.unobserve(entry.target);
        // 超出最大长度直接上报
        if (this.dataList.length >= this.maxNum) {
            console.log('超出上报',this.dataList)
            this.send();
        } else if (this.dataList.length > 0) {
            this._timer = setTimeout(() => { // 定时上报
                console.log('定时上报',this.dataList)
                this.send();
            }, this.time);
        }
        
    }
    // 触发上报数据 
    send() {
        const data = this.dataList.splice(0, this.maxNum)
        // const data = this.dataList.slice(0, this.maxNum);
        console.log('---上报埋点数据BuriedPoint---',data);
        
        // this.dataList = this.dataList.slice(this.maxNum, this.dataList.length);
        console.log(' this.dataList', this.dataList);
        this._timer && clearTimeout(this._timer); // 清除定时器
    }
     // 组件销毁，数据全部上报
    beforeUnmount() {
    }

}

export default BuriedPoint;
