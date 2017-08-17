<style type="text/css">
#gb2{
position:fixed;
top:150px;
z-index:+1000;
}
* html #gb2{position:relative;}

.gb2tab{
height:180px;
width:50px;
float:left;
cursor:pointer;
background:url('../2.bp.blogspot.com/-n-ZnLgqWmMU/VFLlz6azOuI/AAAAAAAAA0Y/3rwO2Ubt3Dw/s1600/fecharxat2.png') no-repeat;
}
.gb2content{
float:left;
border:2px solid #999999;
background:#ffffff;
padding:0px;
}

</style>


<script type="text/javascript">
function showHideGB2(){
var gb2 = document.getElementById("gb2");
var w = gb2.offsetWidth;
gb2.opened ? moveGB2(0, 50-w) : moveGB2(21-w, 0);
gb2.opened = !gb2.opened;
}
function moveGB2(x0, xf){
var gb2 = document.getElementById("gb2");
var dx = Math.abs(x0-xf) > 10 ? 5 : 1;
var dir = xf>x0 ? 1 : -1;
var x = x0 + dx * dir;
gb2.style.right = x.toString() + "px";
if(x0!=xf){setTimeout("moveGB2("+x+", "+xf+")", 10);}
}
</script>




 

<div id="gb2" style="right: -500px;">

<div onclick="showHideGB2()" class="gb2tab"> </div>

<div class="gb2content">


<div style="text-align: center; line-height: 0" id="cboxdiv">
<div style="margin-right:0px">
<p>
<div id="muteYouTubeVideoPlayer">
</div>
<script async src="https://www.youtube.com/iframe_api"></script>
<script>
 function onYouTubeIframeAPIReady() {
  var player;
  player = new YT.Player('muteYouTubeVideoPlayer', {
    videoId: 'Y3nxTuzui2M', // YouTube Video ID
    width: 400,               // Player width (in px)
    height: 280,              // Player height (in px)
    playerVars: {
      autoplay: 1,        // Auto-play the video on load
      controls: 1,        // Show pause/play buttons in player
      showinfo: 0,        // Hide the video title
      modestbranding: 1,  // Hide the Youtube Logo
      loop: 1,            // Run the video in a loop
      fs: 0,              // Hide the full screen button
      cc_load_policy: 0, // Hide closed captions
      iv_load_policy: 3,  // Hide the Video Annotations
      autohide: 0         // Hide video controls when playing
    },
    events: {
      onReady: function(e) {
        e.target.mute();
      }
    }
  });
 }
</script>
</p>
</div></div></div></div>