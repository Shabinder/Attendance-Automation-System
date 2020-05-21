console.log("POPUP Script in Action!");
load();
let bgpage = chrome.extension.getBackgroundPage();
if (bgpage.word == "Page being used is ZOOM"){
    document.getElementById("time_div").style.display = "none";
}
let params= {
    active: true,
    currentWindow: true
}
var config = 0;
function load() {
    chrome.storage.local.get('given_len', function (result) {
        rollno_len1 = result.given_len;
        //alert(result.given_len);
        var elem = document.querySelector('#rolllen');
        if(rollno_len1 != undefined){
            elem.setAttribute("placeholder",rollno_len1);
            elem.setAttribute("value",rollno_len1);
        }
    });
} 
window.onload=function(){
    
    document.getElementById("myBtn").addEventListener("click", function(){
        buttonClicked();
        save();
    });
    document.getElementById("add_sname").addEventListener("click",function(){
        console.log("clicked on Add Name checkbox");
        
    });
    document.getElementById("add_time").addEventListener("click",function(){
        console.log("clicked on Add Name checkbox");
    
    });

    function buttonClicked(){
        var data = [];
        var rollno_len = Number((document.getElementById("rolllen").value));
        var sname = document.getElementById("add_sname");
        var time = document.getElementById("add_time");
        console.log("buttonCicked");
        data.push(rollno_len);
        chrome.tabs.query(params,doIt);
        if (sname.checked == true || time.checked == true){
            if (sname.checked == true && time.checked == true){
                data.push(4);
            }else{ 
                if(sname.checked==true){
                    data.push(2);
                }else{
                    data.push(3);
                }
            }
        }else{data.push(1);} 
        console.log(data);
        function doIt(tabs){
            chrome.tabs.sendMessage(tabs[0].id,data);
        }
        
    } 
    
    function save(){
        var rollno_len1 = Number((document.getElementById("rolllen").value));
        var sname = document.getElementById("add_sname");
        var time = document.getElementById("add_time");
        chrome.storage.local.set({'given_len': rollno_len1},function(){
            //alert(rollno_len1);
            load();
        });
    }

    
}

