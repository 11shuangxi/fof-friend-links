import Model from 'flarum/common/Model';

export default class FriendLink extends Model {}

FriendLink.prototype.site_name = Model.attribute('site_name');
FriendLink.prototype.site_url = Model.attribute('site_url');
FriendLink.prototype.logo_url = Model.attribute('logo_url');
FriendLink.prototype.status = Model.attribute('status');
FriendLink.prototype.reject_reason = Model.attribute('reject_reason');
FriendLink.prototype.createdAt = Model.attribute('createdAt', Model.transformDate);
FriendLink.prototype.approvedAt = Model.attribute('approvedAt', Model.transformDate);
FriendLink.prototype.user = Model.hasOne('user');
