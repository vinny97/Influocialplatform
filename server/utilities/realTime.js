

const emitEvent = (event,sentTo,data= {}) => {
    InfluocialSocket.emit(event+sentTo, data);
};

module.exports = { 
    emitEvent
};
