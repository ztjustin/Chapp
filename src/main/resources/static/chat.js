var stompClient = null;
var OpenConnectionURL = '/hello';

var NewJoinURL = '/chat/joined';
var NewMessageURL = '/chat/new/message';

var SendNameURL = "/app/hello";
var SendMessageURL = "/app/send/message";

var userName = "@default";

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('chatMessage').style.visibility = 'hidden';
    document.getElementById('chatBox').innerHTML = '';
}

function connect() {
    var socket = new SockJS(OpenConnectionURL);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        setConnected(true);
        console.log('Connected: ' + frame);

        stompClient.subscribe(NewJoinURL, function(greeting){
            showGreeting(JSON.parse(greeting.body).content);
        });

        stompClient.subscribe(NewMessageURL, function(chatMessage){
            showMessage(JSON.parse(chatMessage.body));
        });


    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function joinChat() {
    userName = "@" + document.getElementById('name').value;
    stompClient.send(SendNameURL, {}, JSON.stringify({ 'sender': userName }));
}

function sendMessage() {
    var message = document.getElementById('message').value;
    stompClient.send(SendMessageURL, {}, JSON.stringify({ 'sender': userName, 'content': message, 'sendDate': new Date()  }));
    document.getElementById('message').value = '';
}

function showGreeting(message) {
    addContentToChat(message);
    showChatMessageBox();
    hideLoginBox();
}


function showMessage(userMessage) {
    addContentToChat(userMessage.sender + " said " + userMessage.content + " at " + new Date(userMessage.sendDate));
}

function addContentToChat(text){
    var chatBox = document.getElementById('chatBox');
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.appendChild(document.createTextNode(text));
    chatBox.appendChild(p);
}


function showChatMessageBox() {
    document.getElementById('chatMessage').style.visibility = 'visible';
}

function hideLoginBox(){
    document.getElementById('login').style.visibility = 'hidden';

}