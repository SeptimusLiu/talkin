/**
 * This is the protocols that socket follows when transmiting with clients.
 * Build message or login info packet instead of manually writing it every time,
 * and this is what protocols will do.
 * Maybe some extension will be made in the future.
 * 
 * @Septimus.Liu
 */

var utils = require('./utils');

var protocols = {};

/**
 * Build for message packet
 * @param {Object} option [packet info]
 */
function Message(option) {
	this.id = option.id || utils.pickId();
	this.user_id = option.user_id;
	this.user_name = option.user_name;
	this.content = option.content;
	this.time = option.time ? option.time : new Date();	
}

function User(option) {
	this.id = option.id || utils.pickId();
	this.name = option.name;
	this.socket_id = option.socket_id;
	this.avatar_id = option.avatar_id || 0;
}

/**
 * Reserve for notification extension
 */
function Notification(option) {
	this.channel_id = option.channel_id;
	this.channel_name = option.channel_name;
	this.user_id = option.user_id;
	this.user_name = option.user_name;
}

protocols.message = {
	/**
	 * Return a well-formed message packet.
	 */
	construct: function (option) {
		return new Message(option);
	},

	validate: function (message) {

	}
};

protocols.user = {
	construct: function (option) {
		return new User(option);
	}
};

protocols.notification = {
	construct: function (option) {
		return new Notification(option);
	}
};

module.exports = protocols;