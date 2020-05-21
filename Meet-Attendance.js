console.log("Meet-Attendance.js in Action!!");
console.log(document.domain);
if(document.domain == "zoom.us" || document.domain == "us04web.zoom.us"){
    let mess_zoom = {
        text: "Page being used is ZOOM"
    };
    chrome.runtime.sendMessage(mess_zoom);
    console.log("message sent");
}else{
    let mess_zoom = {
        text: "Page being used is not ZOOM"
    };
    chrome.runtime.sendMessage(mess_zoom);
    console.log("message sent");
}
var out=[];
var sender_arr = [];

function find_duplicates(arr) {
    var len=arr.length,
        
        counts={};
  
    for (var i=0;i<len;i++) {
      var item = arr[i];
      counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
      if (counts[item] === 2){
            out.push(i);
        }
    }
    return out;
}
  
chrome.runtime.onMessage.addListener(startIt);
function startIt(message,sender,sendResponse){
    console.log(message);
    console.log(typeof(message));
    var rollno_len = message[0];
    var sname_start = rollno_len + 3;

    var config = message[1];
    if(document.domain == "meet.google.com"){
        console.log("You are on Google Meet session");
        var today = new Date();
        var month = today.getMonth();
        var day = today.getDate();
        var hours = today.getHours();
        var file_name = "Attendance:" + hours + "hrs-" + day +"-" + month + ".txt"  ;
        takeAttendance();
        function takeAttendance(){
            var attendance = [];
            var arr_elms = [];
            arr_elms = document.body.getElementsByTagName("div");
            var elms_len = arr_elms.length;
            attendance.push("PRESENT STUDENTS:" + "\n");
            for (var i=0; i < elms_len;i++) {
                if(arr_elms[i].getAttribute("data-message-text")!=null){
                    var rollNo = arr_elms[i].getAttribute("data-message-text");
                    if(rollNo!=0 && rollNo.length==rollno_len){
                        var sender_id = arr_elms[i].parentElement.parentElement.getAttribute("data-sender-name");
                        var time_stamp = arr_elms[i].parentElement.parentElement.getAttribute("data-formatted-timestamp");
                        sender_arr.push(sender_id);  
                        switch (config) {
                            case 1:
                                attendance.push(rollNo + "\n");
                              break;
                            case 2:
                                attendance.push(rollNo + " : "+ sender_id + "\n");
                              break;
                            case 3:
                                attendance.push(rollNo + " : "+ time_stamp + "\n");
                              break;
                            case 4:
                                attendance.push(rollNo + " : "+  time_stamp + " : " +sender_id + "\n");
                              break;  
                            default:
                              alert("error occured");
                        }
                    }
                }
            }
            

            attendance.forEach((any, index, array) => {
                if (index === array.length - 1) {
                    var dup_entries = [];
                    dup_entries.push("\n"+"DUPLICATE ENTRIES-"+"\n");
                    console.log(sender_arr);
                    find_duplicates(sender_arr);
                    console.log(out);
                    for (var key in out){
                        var dup_index = out[key] + 1;
                        var dup_entry = attendance[dup_index]
                    
                        if(dup_entry != undefined){
                            dup_entries.push(dup_entry);
                            dup_entries.push("\n");    
                        }
                        
                    }
                    attendance.sort(function(a, b){return a.slice(0,rollno_len) - b.slice(0,rollno_len)});
                    console.log(dup_entries);
                    for (var key in attendance) {
                        var value = attendance[key];
                        console.log(value);         
                    }
                    var final_attendance = attendance.concat(dup_entries);

                    ptetxt(file_name, final_attendance);
                }
            });
        }
    }

    if(document.domain == "zoom.us" || document.domain == "us04web.zoom.us"){
        console.log("You are on Zoom session");
        var today = new Date();
        var month = today.getMonth();
        var day = today.getDate();
        var hours = today.getHours();
        var file_name = "Attendance:" + hours + "hrs-" + day +"-" + month + ".txt"  ;
        takeAttendance();
        function takeAttendance(){
            var attendance = [];
            var arr_elms = [];
            var msg_cntnr = [];
            arr_elms = document.body.getElementsByClassName("footer-button__button ax-outline");
            msg_cntnr = document.getElementsByClassName("chat-item__chat-info-msg");
            var elms_len = arr_elms.length;
            var cntnr_len = msg_cntnr.length;
            for (var i = 0; i < elms_len; i++) {
               if(arr_elms[i].getAttribute("aria-label") == "open the chat pane"){
                    arr_elms[i].click();
                    alert("Your ChatBox wasnt Open before.\nWe will open it for you :-)!\nNow Click on TakeAttendance button again to take attendance.");
                    return;
                }
            }
            attendance.push("PRESENT STUDENTS:" + "\n");
            for(var a=0;a<cntnr_len;a++){
                if(msg_cntnr[a].innerHTML != null){
                    var rollNo = msg_cntnr[a].innerHTML.match(/\d+/);
                    var rollNo1 = String(rollNo);
                    if(rollNo1!=0 && rollNo1.length==rollno_len){
                        var sender_id = msg_cntnr[a].previousElementSibling.firstChild.innerHTML;
                        switch (config) {
                            case 1:
                                attendance.push(rollNo1 + "\n");
                              break;
                            case 2:
                                attendance.push(rollNo1 + " : "+ sender_id + "\n");
                              break;
                            case 3:
                                attendance.push(rollNo1 + " : "+ sender_id + "\n");
                              break;
                            case 4:
                                attendance.push(rollNo1 + " : "+ sender_id + "\n");
                              break;  
                            default:
                              alert("error occured");
                        }

                    }
                }
            }
           attendance.forEach((any, index, array) => {
                if (index === array.length - 1) {
                    attendance.sort(function(a, b){return a - b});
                    for (var key in attendance) {
                        var value = attendance[key];
                        console.log(value);         
                    }
                    ptetxt(file_name, attendance);
                }
            });
            
        }
    }
} 

function ptetxt(file_nam, content) {
    var pData = new Blob(content, { type: 'text/plain' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
        window.navigator.msSaveOrOpenBlob(pData, file_name);
    } else { // for Non-IE (chrome, firefox etc.)
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var pUrl = URL.createObjectURL(pData);
        a.href =  pUrl;
        a.download = file_nam;
        a.click();
        
        URL.revokeObjectURL(a.href)
        a.remove();
    }
};