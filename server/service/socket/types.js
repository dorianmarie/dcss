// Note: this file is used by <root>/client/hoc/withSocket.jsx

// Client -> Server
exports.AGENT_ACTIVATE = 'agent-activate';
exports.AGENT_DEACTIVATE = 'agent-deactivate';
exports.AGENT_PAUSE = 'agent-pause';
exports.AGENT_START = 'agent-start';
exports.CREATE_CHAT_CHANNEL = 'create-chat-channel';
exports.CREATE_CHAT_SLIDE_CHANNEL = 'create-chat-slide-channel';
exports.CREATE_CHAT_USER_CHANNEL = 'create-chat-user-channel';
exports.CREATE_COHORT_CHANNEL = 'create-cohort-channel';
exports.CREATE_USER_CHANNEL = 'create-user-channel';
exports.DISCONNECT = 'disconnect';
exports.HEART_BEAT = 'heart-beat';
exports.USER_JOIN = 'user-join';
exports.USER_PART = 'user-part';
exports.USER_JOIN_SLIDE = 'user-join-slide';
exports.USER_PART_SLIDE = 'user-part-slide';
exports.USER_IS_TYPING = 'user-is-typing';
exports.USER_NOT_TYPING = 'user-not-typing';

// Client <- Server
exports.NEW_INVITATION = 'new-invitation';
exports.SET_INVITATION = 'set-invitation';
exports.NOTIFICATION = 'notification';

// Server -> Client
exports.AGENT_JOINED = 'agent-joined';
exports.CHAT_QUORUM_FOR_SLIDE = 'chat-quorum-for-slide';
exports.CHAT_CREATED = 'chat-created';
exports.CHAT_CLOSED = 'chat-closed';
exports.CHAT_ENDED = 'chat-ended';
exports.CHAT_OPENED = 'chat-opened';
exports.JOIN_OR_PART = 'join-or-part';
exports.RUN_CHAT_LINK = 'run-chat-link';

// Client -> Server -> Client
exports.CHAT_CLOSED_FOR_SLIDE = 'chat-closed-for-slide';
exports.CHAT_MESSAGE_CREATED = 'chat-message-created';
exports.CHAT_MESSAGE_UPDATED = 'chat-message-updated';
exports.TIMER_END = 'timer-end';
exports.TIMER_START = 'timer-start';
exports.TIMER_STOP = 'timer-stop';
exports.TIMER_TICK = 'timer-tick';
