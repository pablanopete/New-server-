javascript const WebSocket = require( 'ws');
const PORT = process. env. PORT || 8080; const
wss = new WebSocket. Server(f port: PORT });
const connections = new Map(); // userId →>
ws const waitingUsers = new Map(); // odId ->
i ws, userData } const chatPairs = new
Map ( );
// odId → oderId
console. log ( Server running on port ${PORT}
'); // Broadcast online count every 5
seconds setInterval(() => {
const count =
connections. size; const msg =
JSON. stringify(f type: 'online_count', payload: count 3); connections. forEach (ws = {
if (ws.readyState ===
WebSocket.OPEN) ws. send(msg); 3); 3, 5000);
wss. on ( connection', (ws, req) = 1
const
userId = new URL (req.url, 'http: //
localhost'). searchParams get ('userId');
if
(luserId) return ws.close ( );
connections. set(userId, ws);
console. log ( Connected: ${userId} ($ {connections size} online)');
// Send
initial online count
ws. send (JSON. stringify({ type:
'online_count', payload: connections. size }));
(data) => {
try {
JSON. parse (data) ;
ws. on ( 'message', const message =
handleMessage userId,
        message, ws);
} catch (e)
{ e) ;
console. error 'Parse error:'
} });
ws. on ( 'close'
, () =>
connections delete (userId);
waitingUsers delete (userId);
//
Notify partner if in chat
const partnerid
= chatPairs.get (userId);
if (partnerId)
{
chatPairs delete (userId) ;
chatPairs.delete (partnerId);
const
partnerWs = connections get (partnerId);
if (partnerWs?. readyState === WebSocket.OPEN)
partnerWs. send (JSON. stringify({ typ
e: 'partner _disconnected' }));
}
}
console. log ( Disconnected: ${userId} ($ {connections size} online) '); }); }); function handleMessage (userId, message, ws)
{
switch (message.type) {
case
'start_search' :
handleStartSearch(userId, message. payload,
WS) ;
break;
case 'cancel_search':
waitingUsers.delete(userId);
break;
case 'send_message' : handleSendMessage (userId, message.payload); break;
case 'disconnect_partner':
handleDisconnectPartner (userId);
break;
case 'report_user':
handleDisconnectPartner (userId); // Just disconnect for now
break; } }
function handleStartSearch(userId, userData,
ws {
/I Look for compatible match for
(const [waitingId, waitingl of waitingUsers)
{
if (waitingId === oderId) continue;
if (isCompatible(userData, waiting.userData))
// Match found!
waitingUsers.delete(waitingId);
  // Create chat pair
chatPairs.set(userId, waitingId);
chatPairs.set(waitingId,
oderId) ;
ws. send (JSON. stringify(f
// Notify both users
type:
'matched',
payload: 1
id:
waitingId,
displayName:
waiting.userData.displayName, gender: waiting. userData.gender, bio: waiting.userData.bio, avatarUrl: null
}
3));
waiting.ws. send (JSON. stringify({
typ
e: 'matched',
payload:
id: userId,
displayName: userData. displayName, gender: userData gender,
bio:
userData. bio,
avatarUrl:
null
3)) ;
console. log ( Matched: ${userId} ‹-> $ {waitingId}');
return;
/ No match, add to
queue
waitingUsers.set(userId, & ws,
userData 3);
ws. send (JSON. stringify({ type:
'searching' }));
console. log ('Searching: $
{userId} (${waitingUsers.size} in queue) '); }
function isCompatible(user1, user2) {
const
filter10k = user1. genderFilter === 'any' ||
user1. genderFilter === user2. gender;
const
filter20k = user2 genderFilter === 'any' |l
user2. genderFilter === user. gender;
return
filter10k && filter20k; } function
handleSendMessage(userId, messageData)
const partnerId = chatPairs get (userId);
if (!partnerId) return;
const partnerWs
  = connections get(partnerId); if (partnerWs?. readyState === WebSocket.OPEN)
{
partnerWs. send (JSON. stringify (f
t
ype: 'message'
payload: {
Date. now() .toString(),
id:
•..messageData
timestamp:
Date.now()
3)): 3}
handleDisconnectPartner (userId) {
partnerId = chatPairs. get (userId);
function const if (!
partnerId) return;
chatPairs. delete(userId);
chatPairs.delete (partnerId);
const
partnerWs = connections get (partnerId);
if
(partnerWs?. readyState === WebSocket. OPEN)
partnerWs. send (JSON. stringify({ type:
'partner_disconnected' 3)); } }
  
