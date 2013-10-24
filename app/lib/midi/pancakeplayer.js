/* 필요한 js include
	<script src="./inc/jasmid/stream.js"></script>
	<script src="./inc/jasmid/midifile.js"></script>
	<script src="./inc/jasmid/replayer.js"></script>
	<script src="./inc/Base64.js"></script>
	<script src="./inc/base64binary.js"></script>
	<script src="./inc/WebMIDIAPI.js"></script>
	<script src="./inc/SoundManager2/script/soundmanager2.js"></script>
	<script src="./js/MIDI/AudioDetect.js"></script>
	<script src="./js/MIDI/LoadPlugin.js"></script>
	<script src="./js/MIDI/Player.js"></script>
	<script src="./js/MIDI/Plugin.js"></script>
	<script src="./js/Window/DOMLoader.script.js"></script>
	<script src="./js/Window/DOMLoader.XMLHttp.js"></script>
	<script src="./js/Window/Event.js"></script>
*/


MIDI.noteOn(channel, note, velocity, delay);
MIDI.noteOff(channel, note, delay);

//channel의 경우 악기마다 분리해주면 되는데 복수의 악기를 지원하기 전까진 임의의 채널(0~15)에 고정하여 사용.
//note는 0~127에 해당하는 노트값
//velocity는 0~127에 해당하는 타건속도-얼마나 건반을 강하게 누르는지에 대한 값. 적당한 값으로 고정하여 사용하면 될듯.
//delay는 초단위의 딜레이. 0으로 해놓고 사용해야 함.



//**** play 하기 위한 요건이자 에디터에서 받아오는 데이터를 저장하기 위한 포맷 ****
//midi/inc/jasmid/midifile.js의 MidiFile 클래스의 형식에 맞추어 데이터 생성한 후 플레이어에 그것을 던져주어야 함.
//간단한 코드인데다 정리가 깔끔하게 되어있어서 그대로 사용함.

//MidiFile class의 필요 데이터
//

