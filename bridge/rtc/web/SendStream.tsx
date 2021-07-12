import {Symbl} from "./symbl";
import React, {useCallback, useState,createContext} from 'react';
import {UserrIdToUSernameMappring} from '../web/UserrIdToUSername';

import SessionContext from "../../../src/components/SessionContext";
import { v4 as uuidv4 } from 'uuid';
import {PropsInterface} from "../../../agora-rn-uikit/src/PropsContext";
export let cci="";
let tti="";
import symblConfig from "../../../SymblConfig";

import Emitter from './emitter';


const getContent = (data) => {

    const punctuated = data.data.punctuated;
    const payload =data.data.payload;


    if (punctuated && punctuated.transcript) {
        return punctuated.transcript;
    } else if (payload && payload.content) {
        return payload.content;
    } else if (payload && payload.raw && payload.raw.alternatives && payload.raw.alternatives.length > 0) {
        return payload.raw.alternatives[0].transcript || '';
    }
    return undefined;
}
 export const  SymblContext=React.createContext(null);
export const StorageConsumer = SymblContext.Consumer;
let m = new Map;
let symbl = null, sS = null;
let interTranscript=``;
let interInsight=``;
let interTopic=``;


export function getInterTranscript(){

    return interTranscript;

   // return interTranscript;

}
export function getInterInsight(){
    return interInsight;

}
export async function SendStream(channelName,optionalUid,optionalInfo) {
    if (symbl || sS ) {
        return { sS, symbl };
    }

    /////

    //const [closedCaptionResponse,setClosedCaptionResponse]=useState({});
    /*const [conversationCompleted, setConversationCompleted]=useState ({});
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [insights, setInsights] = useState([]);
    const [newInsights, setNewInsights] = useState([]);
    const [tracker, setTracker] = useState([]);*/



    /////


    ///Fetch token new method using credentials
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({"type":"application",
        "appId":symblConfig.symbl_AppId,
        "appSecret":symblConfig.symbl_AppSecret
    });

    let Options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    //////


    let data;
       // const res =  await fetch("https://2201b035aeec.ngrok.io/symbl-token");
   // const res =  await fetch("https://nameless-ocean-51059.herokuapp.com/symbl-token");
    if(window.localStorage.getItem("symblToken")==null||window.localStorage.getItem("symblToken")==undefined){
        const res =  await fetch("https://api.symbl.ai/oauth2/token:generate",Options);
         data=await res.json();
         window.localStorage.setItem("symblToken",data.accessToken);
    }
    else {
        console.log("symbl token is already there");
        const res = null;//await fetch("https://api.symbl.ai/oauth2/token:generate",Options);
         data = window.localStorage.getItem("symblToken");//await res.json();
    }
        //console.log("getting accesstoken"+data.ACCESS_TOKEN);
        ///importing username from vvideoCall.ts
        const userName=  new UserrIdToUSernameMappring().getUserMap(optionalUid);
        const un=document.getElementById("username").innerText;

        let mId=uuidv4();
        const config = {
            attendeeId: userName,
            userName: un,
            meetingId: channelName,
            meeting: channelName
        };
        console.log("Got symbl token", data, config);
    console.log("Got symbl token from window", window.localStorage.getItem("symblToken"));
        //const tempAccesstoken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjY2NjY2MDk1Njc0NjU0NzIiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiajRuOWZkYnk3dFE4bGtoZlBpeVJxM21UZ2twR0hrRXBAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjE5MzkzODgwLCJleHAiOjE2MTk0ODAyODAsImF6cCI6Imo0bjlmZGJ5N3RROGxraGZQaXlScTNtVGdrcEdIa0VwIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.VJ8SGx8WZskJ_KoqgzDglPqxDKby94UI48vKlU7V1OdeiCDFx7NFawpw5wSP9sPjdTGoIggwERcpV8o6EMGWKbS9CxogqB1Jb2iQYBhF8RFN8hrzyb39BtAWPDrGAkf7FXs4lxnwrEZbw8qt_qOeYoAVc7s0fiv88d91lCCX4EQMnRAWWo5cRp5BJkOwnc5po5ADcTaoVyxQuICGDp_BRS_aK9D1klRAXEA5czq7pGAEwGk_j-UbfRzMBLhJe-PfsCwIEMeQ-8vmhCc2o3MRi4D6HITzQcPASzYJ2o1nrX1Rq0OK0VZbARn0K3IVM7HFBBDRcVr8uc41XLx1YOIjvQ";
        Symbl.ACCESS_TOKEN = window.localStorage.getItem("symblToken");//data.accessToken;
        //window.localStorage.setItem("symbltoken",Symbl.ACCESS_TOKEN);

    symbl = new Symbl(config);
        var _caption = '';
        const captioningHandler = {
            onCaptioningToggled: ccEnabled => {
                // Implement
            },
            onCaptionCreated: (caption) => {
                ////new code added for caption ;
                cci=caption;
                // Retrieve the video element that you wish to add the subtitle tracks to.
                // var activeVideoElement = document.querySelector("video");
                var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                if (videoElementContainer) {
                    const activeVideoElement = videoElementContainer.querySelector('video');
                    caption.setVideoElement(activeVideoElement);
                }

            },
            onCaptionUpdated: (caption) => {
                // Check if the video element is set correctly

                var videoElementContainer = document.getElementsByClassName('main-stream-player')[0];
                var check = document.getElementById("test");
                cci=JSON.stringify(caption);


                //setClosedCaptionResponse(caption);
                if(document.getElementById("tes")!=null) {
                    document.getElementById("tes").innerText = caption.data.user.name+":"+getContent(caption);
                }

                if (videoElementContainer) {
                    const activeVideoElement = videoElementContainer.querySelector('video');
                    caption.setVideoElement(activeVideoElement);
                }
            }
        };
        symbl.subscribeToCaptioningEvents(captioningHandler);

     sS = await symbl.start();





        /*

        then((val)=>{
            m.set(channelName,val._conversationId);
            console.log("starting symbl");
            console.log("send stream"+val.conversationId());


        });
         */



    if(!m.has(channelName))
    {
    }





    return {sS,symbl};
   /* return (
        <SymblContext.Provider
            value={{

                closedCaptionResponse


            }}
        >
            {this.props.children}
        </SymblContext.Provider>
    );*/


}





/*export function sp(text){

    const [closedCaptionResponse,setClosedCaptionResponse]=useState({});
    setClosedCaptionResponse(text);
    return (
        <SymblContext.Provider
            value={{

                closedCaptionResponse


            }}
        >
            {this.props.children}
        </SymblContext.Provider>
    );
}*/


