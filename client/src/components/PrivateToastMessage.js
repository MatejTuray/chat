import React from 'react';
import moment from "moment";
import JSEMOJI from 'emoji-js';
import { Emojione } from 'react-emoji-render';
const jsemoji = new JSEMOJI();
jsemoji.img_set = 'emojione';
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';
jsemoji.supports_css = false;
jsemoji.allow_native = false;
jsemoji.replace_mode = 'unified';
jsemoji.use_sheet = true;
jsemoji.init_env(); 
jsemoji.replace_mode = 'unified';
jsemoji.allow_native = true;

const  PrivateToastMessage = (props) => {
  return (
    <div className="toast-private-message">
      <div className="d-flex justify-content-start">
      <img className="rounded-circle mt-3 ml-3 pt-2 toast_image" src={props.msgImg}/>
      <h6 className="text-center private-message_from">{props.msgFrom}</h6>
      </div>
      <div className="toast-private-message_body d-flex justify-content-between">
      
      <Emojione className="ml-2" text={props.msgText}></Emojione>
      <small className="mr-2 float-right">{moment(props.msgCreatedAt).format("HH:MM")}</small>
      </div>
     
    </div>
  )
}
export default PrivateToastMessage