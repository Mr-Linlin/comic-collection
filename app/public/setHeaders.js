'use strict';
// eslint-disable-next-line jsdoc/require-param
const config = require('./config/qiniu_config');

/**
 * 设置请求头
 * @param xhr
 * @return {*}
 */
module.exports = xhr => {
  xhr.set('Accept', '*/*');
  xhr.set('Accept-Encoding', 'gzip, deflate, br');
  xhr.set('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
  xhr.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.set('Cookie', '_uab_collina=167325941427744886021718; tk=BdkZv-mQQb2jHjRHkS_sRc1yvvnAbj-O6ebgajTb4osfsl1l0; JSESSIONID=9C52BA8D3364B6FCE1544E24EE581D33; RAIL_EXPIRATION=1673604011314; RAIL_DEVICEID=hf9Mok8o64MFMcTaCBlcn5rsKBC5F2ErOvPP-kWcHCtSzDaqjjjXFtysuXSqWZGi_Hx04yUYTHIW9zcL2S9OWrboTEpAxIa0ckp4X56r0knWyECBv8lIj4FGSEbMNmk29xSWcEm8AkkzYbT3fkRMmAMeHUO1E5XO; BIGipServerpassport=770179338.50215.0000; guidesStatus=off; highContrastMode=defaltMode; cursorStatus=off; route=c5c62a339e7744272a54643b3be5bf64; _jc_save_wfdc_flag=dc; BIGipServerpool_passport=216269322.50215.0000; current_captcha_type=Z; _jc_save_toDate=2023-01-11; _jc_save_fromDate=2023-01-11; BIGipServerindex=1071186186.43286.0000; fo=fvy4wnxraui2hlcf_fxllOi1yK0kafg_BPWbtbwyo_dEcmPOzn0dFFzjC_AbMuVr_88AH2Ci73NvpUoXLqcwvaoI_YRGUXqKNAUKdmxLevkJZk8xHJ__r-iVzaJ9LMCqkF-oNouvSl47Kr28yXQiY41CYf2xBIrgVJBZL_eAwFDNt7SEntXw7D-al_A; BIGipServerotn=2263351562.64545.0000; uKey=f6860755a82dc02873394369427cbb30cc1b14d6c91300bcbe4f023be08ac374; _jc_save_fromStation=%u5317%u4EAC%2CBJP; _jc_save_toStation=%u4E0A%u6D77%2CSHH');
  xhr.set('Host', 'kyfw.12306.cn');
  xhr.set('Origin', 'https://kyfw.12306.cn');
  xhr.set('Referer', 'https://kyfw.12306.cn/otn/confirmPassenger/initDc');
  xhr.set('Sec-Fetch-Mode', 'cors');
  xhr.set('Sec-Fetch-Site', 'same-origin');
  xhr.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363');
  xhr.set('X-Requested-With', 'XMLHttpRequest');
  return xhr;
};
