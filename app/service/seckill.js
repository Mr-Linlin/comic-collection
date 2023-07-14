"use strict";

const Service = require("egg").Service;
const nodemailer = require("nodemailer");
const cheerio = require("cheerio");

class SeckillService extends Service {
  /**
   *
   * @param {*} data 请求参数
   * @return 返回车次信息
   */
  async getTrainList(data) {
    console.log(data);
    // const param = {
    //   'leftTicketDTO.train_date': '2023-01-11',
    //   'leftTicketDTO.from_station': 'KTQ',
    //   'leftTicketDTO.to_station': 'IOQ',
    //   purpose_codes: 'ADULT',
    // };
    const { sign } = await this.ctx.service.cartoonManage.getCartoonDetailModel(
      { id: 2 },
      "lin_sign"
    );

    const url = `https://kyfw.12306.cn/otn/leftTicket/queryZ?leftTicketDTO.train_date=${data.departTime}&leftTicketDTO.from_station=${data.fromStation}&leftTicketDTO.to_station=${data.toStation}&purpose_codes=ADULT`;
    const query = {
      method: "GET",
      dataType: "json",
      headers: {
        Cookie: sign,
      },
    };
    const result = await this.ctx.curl(url, query);
    // console.log(sign, 'result');
    try {
      if (result.status === 200 && result.data) {
        console.log(result.data, "===========");
        const queryZResult = result.data.data.result.filter((item) => {
          const arr = item.split("|");
          const deTime = new Date(`${data.departTime} ${arr[8]}:00`).getTime();
          const time = new Date().getTime();
          return deTime - time > 20000;
        });
        // console.log(queryZResult, 'queryZResult');
        const queryItem = queryZResult.find((item) => {
          const arr = item.split("|");
          return (
            arr[11] === "Y" &&
            ((arr[30] && arr[30] !== "无") || (arr[31] && arr[31] !== "无"))
          );
        });
        if (!queryItem) {
          return { code: 201, msg: "无票", data: {} };
        }
        data.account = "1908878835@qq.com";
        data.trainNumber = queryItem.split("|")[3];
        // 有票开启提醒
        await this.setEmailModel(data);
        // console.log(resEmail, 'resEmail');
        // const setStr = queryItem.split('|')[0];
        // 校验登录
        // const loginUrl = 'https://kyfw.12306.cn/otn/login/checkUser';
        // query.method = 'POST';
        // query.headers.Cookie = '_uab_collina=167325941427744886021718; JSESSIONID=B1A69C01D13496F1B43A40A1DEDA3821; RAIL_EXPIRATION=1673604011314; RAIL_DEVICEID=hf9Mok8o64MFMcTaCBlcn5rsKBC5F2ErOvPP-kWcHCtSzDaqjjjXFtysuXSqWZGi_Hx04yUYTHIW9zcL2S9OWrboTEpAxIa0ckp4X56r0knWyECBv8lIj4FGSEbMNmk29xSWcEm8AkkzYbT3fkRMmAMeHUO1E5XO; BIGipServerpassport=770179338.50215.0000; guidesStatus=off; highContrastMode=defaltMode; cursorStatus=off; route=c5c62a339e7744272a54643b3be5bf64; BIGipServerpool_passport=216269322.50215.0000; current_captcha_type=Z; BIGipServerindex=1071186186.43286.0000; BIGipServerotn=2263351562.64545.0000; _jc_save_toDate=2023-01-12; _jc_save_toStation=%u6DF1%u5733%u5317%2CIOQ; _jc_save_fromStation=%u8475%u6F6D%2CKTQ; _jc_save_fromDate=2023-01-12; _jc_save_wfdc_flag=dc; fo=80dlik76hxd8ohuu519Qnd9bYfna3Gh9IleU8k1FnZN64ZTB1L-yR7O9-Vlqgwebr45JZjloC4x0UGmqt8Y0saRvUaIsSMaqi4zb0HetG7Gu09UNKGM7kS7-Y7atFEPevKMNsmE7xerrt78eDsme4W2v958BVRPKWzKjXGpPSW-dYUlEwRk0gc86_FI',
        //   query.data = {
        //     _json_att: '',
        //   };
        // const checkUserResult = await this.ctx.curl(loginUrl, query);
        // if (checkUserResult.status === 200 && checkUserResult.data.data.flag) {
        // console.log('登录成功状态');
        // sign = sign.split(';');
        // sign.splice(0, 1);
        // query.headers.Cookie = sign.join(';');
        // const submitUrl = 'https://kyfw.12306.cn/otn/leftTicket/submitOrderRequest';
        // query.data = {
        //   secretStr: decodeURIComponent(setStr),
        //   train_date: data.departTime,
        //   back_train_date: data.departTime,
        //   tour_flag: 'dc',
        //   purpose_codes: 'ADULT',
        //   query_from_station_name: data.depart,
        //   query_to_station_name: data.goal,
        //   undefined: '',
        // };
        // const submitOrderResult = await this.ctx.curl(submitUrl, query);
        // console.log(submitOrderResult);
        // if (submitOrderResult.data.status && submitOrderResult.status === 200) {
        //   // 获取乘车人信息
        //   url = 'https://kyfw.12306.cn/otn/confirmPassenger/getPassengerDTOs';
        //   query.data = {
        //     _json_att: '',
        //   };
        //   const passengerData = await this.ctx.curl(url, query);
        //   if (passengerData.data.status && passengerData.status === 200) {
        //     // console.log(passengerData.data.data.normal_passengers, '乘车人');
        //     const passenger = passengerData.data.data.normal_passengers[0];
        //     console.log(passenger, 'passenger');
        //     // 提交订单
        //     url = 'https://kyfw.12306.cn/otn/confirmPassenger/checkOrderInfo';
        //     const oldPassengerStr = `${passenger.passenger_name},${passenger.passenger_type},${passenger.passenger_id_no},1_`;
        //     const passengerTicketStr = `1,${passenger.index_id},${passenger.passenger_type},${passenger.passenger_name},${passenger.passenger_id_no},${passenger.is_active},${passenger.mobile_no},${passenger.allEncStr}`;
        //     query.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        //     query.headers['X-Requested-With'] = 'XMLHttpRequest';
        //     query.data = {
        //       cancel_flag: 2,
        //       bed_level_order_num: '000000000000000000000000000000',
        //       passengerTicketStr,
        //       oldPassengerStr,
        //       tour_flag: 'dc',
        //       randCode: '',
        //       whatsSelect: 1,
        //       sessionId: '',
        //       sig: '',
        //       scene: 'nc_login',
        //       _json_att: '',
        //     };
        //     // console.log(query.data);
        //     const checkOrder = await this.ctx.curl(url, query);
        //     console.log(checkOrder.data, 'checkOrder');
        //     if (!checkOrder.data.data.submitStatus) {
        //       return { code: 201, msg: checkOrder.data.data.errMsg };
        //     }
        //   }
        //   // console.log(passengerData, '乘车人');
        // } else {
        //   console.log(submitOrderResult.data.messages[0]);
        // }
        // console.log(submitOrderResult, 'submitOrderResult');

        // 预定车次
        // }
        // else {
        //   // 获取登录验证码
        //   url = 'https://kyfw.12306.cn/passport/web/slide-passcode';
        //   query.method = 'POST';
        //   query.data = {
        //     slideMode: 1,
        //     appid: 'otn',
        //     username: 'linzhentao1220',
        //   };
        //   const result = await this.ctx.curl(url, query);
        //   if (result.status === 200 && result.data.result_code == '0') {
        //     const passToken = result.data.if_check_slide_passcode_token;
        //     console.log(passToken, 'passToken');
        //     // 登录12306并上传到数据库中
        //     url = 'https://kyfw.12306.cn/passport/web/login';
        //     url = 'https://kyfw.12306.cn/passport/web/login';
        //     query.data = {
        //       if_check_slide_passcode_token: passToken,
        //       scene: 'nc_login',
        //       username: 'linzhentao1220',
        //       password: '@nYXihrmHVzd0kzJHHtGTXg==',
        //       checkMode: 1,
        //       appid: 'otn',
        //     };
        //     query.data = {
        //       username: 'linzhentao1220',
        //       password: '@nYXihrmHVzd0kzJHHtGTXg==',
        //       appid: 'otn',
        //       _json_att: '',
        //     };
        //     const loginRes = await this.ctx.curl(url, query);
        //     console.log(loginRes, 'loginRes');

        //   }
        //   // console.log(result);
        //   return { code: 201, msg: '12306Cookie失效，正在重新登录中！', data: {} };
        // }
        return { code: 201, msg: "提醒已发送到邮箱中！" };
      }
      // return { code: 201, msg: '12306Cookie失效！', data: {} };
    } catch (error) {
      console.log(error, "error");
      return { code: 200, msg: "cookie失效，正在重新登录中", data: {} };
    }
  }
  /**
   *
   * @param {*} cookies
   * @param {*} type 区分登录cookie和预定车票cookie
   * @return 上报cookie信息
   */
  async upCookie(cookies, type = 1) {
    cookies = JSON.parse(cookies);
    let cookie = "";
    cookies = cookies.map((item) => {
      return {
        name: item.name,
        value: item.value,
      };
    });
    for (const key in cookies) {
      if (Object.hasOwnProperty.call(cookies, key)) {
        const item = cookies[key];
        // console.log(key);
        if (key == cookies.length - 1) {
          cookie += `${item.name}=${item.value}`;
        } else {
          cookie += `${item.name}=${item.value};`;
        }
      }
    }
    // 保存到数据库
    this.ctx.service.cartoonManage.editCartoonModel(
      { id: 2, sign: cookie, uid: 1 },
      "lin_sign",
      { id: 2 }
    );
    return { code: 200, msg: "上报成功！" };
  }
  /**
   *
   * @param {*} keyWords 搜索关键词
   * @return 返回搜索结果
   */
  async serach(keyWords) {
    // console.log(keyWords);
    keyWords = encodeURI(keyWords);
    const url = `https://www.fangpi.net/s/${keyWords}`;
    const param = {
      headers: {
        dataType: "text",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    };
    const res = await this.ctx.curl(url, param);
    const pageXml = res.data.toString();
    const $ = cheerio.load(pageXml, { decodeEntities: false });
    const musics = [];
    const circles = [];
    const downloads = [];
    // const downurl = [];
    $(".text-primary", "tbody").each(function (i) {
      musics[i] = $(this).text().replace("\n", "");
    });
    $(".text-success", "tbody").each(function (i) {
      circles[i] = $(this).text().replace("\n", "");
    });
    $("a", "td").each(function (i) {
      downloads[i] = $(this).attr("href").split("/")[2];
    });
    // for (let index = 0; index < downloads.length; index++) {
    //   const item = downloads[index];
    // url = `https://www.fangpi.net${downloads[0]}`;
    // const res1 = await this.ctx.curl(url, param);
    // pageXml = res1.data.toString();
    // $ = cheerio.load(pageXml, { decodeEntities: false });
    // const nurl = $("#btn-download-mp3", ".input-group-append").attr("href");
    // // }
    // console.log(nurl, "nurl", pageXml);

    const fruits = musics.map((item, index) => {
      return {
        music: item,
        circle: circles[index],
        musicId: downloads[index],
      };
    });
    // console.log(pageXml);
    return { code: 200, msg: "获取成功！", data: fruits };
  }
  /**
   * @param {*} options 发送的模板信息
   * @return 发送邮件信息
   */
  async sendEmail(options) {
    const transporter = nodemailer.createTransport(this.app.config.qqEmail);
    transporter.sendMail(options, (error, info) => {
      if (!error) {
        return { code: 0, msg: "抢票提醒发送成功", info };
        // eslint-disable-next-line no-else-return
      } else {
        return { code: 1, msg: "抢票提醒发送失败，请稍后重试", error };
      }
    });
  }
  /**
   * @param {*} account 要发送的收件人地址
   * @return 初始化发送模板
   */
  // eslint-disable-next-line no-dupe-class-members
  async setEmailModel({ account, depart, goal, departTime, trainNumber }) {
    // 定义模版
    const email = {
      title: "抢票提醒",
      body: `
             <h1>尊敬的:${account}用户</h1>
             <p style="font-size: 18px;color:#000;">
             列车${trainNumber} ${departTime}从${depart}开往${goal}已经有余票了，请尽快上线抢票
             </p>
             `,
    };
    const emailCotent = {
      from: "2030344925@qq.com", // 发件人地址
      to: `${account}`, // 收件人地址，多个收件人可以使用逗号分隔
      subject: email.title, // 邮件标题
      html: email.body, // 邮件内容
    };
    console.log(emailCotent);
    return await this.sendEmail(emailCotent);
  }
}
module.exports = SeckillService;
