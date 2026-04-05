import app from 'flarum/admin/app';
import FriendLink from '../common/models/FriendLink';
import FriendLinksSettingsPage from './components/FriendLinksSettingsPage';

app.initializers.add('fof-friend-links', () => {
  app.store.models['friend-links'] = FriendLink;

  app.extensionData.for('fof-friend-links')
    .registerPage(FriendLinksSettingsPage);
});
